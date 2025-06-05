package finrem;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import uk.gov.hmcts.befta.BeftaMain;
import uk.gov.hmcts.befta.dse.ccd.CcdEnvironment;
import uk.gov.hmcts.befta.dse.ccd.CcdRoleConfig;
import uk.gov.hmcts.befta.dse.ccd.DataLoaderToDefinitionStore;
import uk.gov.hmcts.befta.util.FileUtils;

import java.util.List;

public class HighLevelDataSetupApp extends DataLoaderToDefinitionStore {

    private static final Logger logger = LoggerFactory.getLogger(HighLevelDataSetupApp.class);

    private static final List<CcdRoleConfig> CCD_ROLES = List.of(
            new CcdRoleConfig("citizen", "PUBLIC"),
            new CcdRoleConfig("caseworker", "PUBLIC"),
            new CcdRoleConfig("caseworker-divorce-financialremedy-courtadmin", "PUBLIC"),
            new CcdRoleConfig("caseworker-divorce-financialremedy-solicitor", "PUBLIC"),
            new CcdRoleConfig("caseworker-divorce-financialremedy-judiciary", "PUBLIC"),
            new CcdRoleConfig("caseworker-divorce-financialremedy-superuser", "PUBLIC"),
            new CcdRoleConfig("caseworker-divorce-systemupdate", "PUBLIC"),
            new CcdRoleConfig("caseworker-divorce-bulkscan", "PUBLIC"),
            new CcdRoleConfig("caseworker-divorce-financialremedy", "PUBLIC"),
            new CcdRoleConfig("caseworker-caa", "PUBLIC"),
            new CcdRoleConfig("caseworker-approver", "PUBLIC"),
            new CcdRoleConfig("caseworker-financialremedy-rparobot", "PUBLIC")
    );

    /**
     * Directory where the import process can locate definition files. See bin/after-data-setuo-step.sh.
     */
    private static final String DEFINITIONS_PATH = "ccd_definition";
    private static final List<CcdEnvironment> SKIPPED_ENVS = List.of(CcdEnvironment.DEMO);

    public HighLevelDataSetupApp(CcdEnvironment dataSetupEnvironment) {
        super(dataSetupEnvironment, DEFINITIONS_PATH);
    }

    public static void main(String[] args) throws Throwable {
        main(HighLevelDataSetupApp.class, args);
    }

    @Override
    public void addCcdRoles() {
        if (getDataSetupEnvironment() == CcdEnvironment.PREVIEW) {
            logger.info("Adding CCD roles");
            CCD_ROLES.forEach(this::addCcdRole);
        }
    }

    @Override
    public void importDefinitions() {
        logger.info("Importing CCD definitions");

        CcdEnvironment ccdEnvironment = (CcdEnvironment) getDataSetupEnvironment();
        logger.info("CCD environment: {}", ccdEnvironment);
        try {
            if (ccdEnvironment != null && !SKIPPED_ENVS.contains(ccdEnvironment)) {
                importDefinitionsAt(DEFINITIONS_PATH);
            } else {
                logger.info("CCD definitions import skipped for {} environment", ccdEnvironment);
            }
        } catch (Exception e) {
            logger.error("Error when importing CCD definitions", e);
            // Exit the process to fail Jenkins pipeline
            System.exit(1);
        }
    }

    @Override
    public void createRoleAssignments() {
        // No implementation required
    }

    @Override
    protected boolean shouldTolerateDataSetupFailure(Throwable e) {
        if (getDataSetupEnvironment() == CcdEnvironment.PREVIEW) {
            logger.error("Data Setup failure ignored", e);
            return true;
        } else {
            return super.shouldTolerateDataSetupFailure(e);
        }
    }

    /**
     * Workaround for <a href="https://tools.hmcts.net/jira/browse/CCD-5362">CCD-5362</a>.
     * @param definitionsPath definitions path
     */
    @Override
    protected void importDefinitionsAt(String definitionsPath) {
        List<String> definitionFileResources = getAllDefinitionFilesToLoadAt(definitionsPath);
        logger.info("{} definition files will be uploaded to '{}' on {}.", definitionFileResources.size(),
                BeftaMain.getConfig().getDefinitionStoreUrl(), getDataSetupEnvironment());

        try {
            for (String fileName : definitionFileResources) {
                importDefinitionFile(fileName);
            }
        } finally {
            FileUtils.deleteDirectory("definition_files");
        }
    }

    private void importDefinitionFile(String fileName) {
        try {
            logger.info("\n\nImporting {}...", fileName);
            importDefinition(fileName);
            logger.info("\nImported {}.\n\n", fileName);
        } catch (Exception e) {
            String message = "Couldn't import {} - Exception: {}.\n\n";
            logger.error(message, fileName, e.getMessage());
            if (!shouldTolerateDataSetupFailure(e)) {
                throw new RuntimeException(e);
            }
        }
    }
}
