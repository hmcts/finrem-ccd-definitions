package finrem;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import uk.gov.hmcts.befta.BeftaMain;
import uk.gov.hmcts.befta.dse.ccd.CcdEnvironment;
import uk.gov.hmcts.befta.dse.ccd.CcdRoleConfig;
import uk.gov.hmcts.befta.dse.ccd.DataLoaderToDefinitionStore;
import uk.gov.hmcts.befta.exception.ImportException;

import javax.crypto.AEADBadTagException;
import javax.net.ssl.SSLException;
import java.util.List;
import java.util.Arrays;

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
            new CcdRoleConfig("caseworker-approver", "PUBLIC")
    );

    private static final String definitionsPath = "ccd_definition";
    private static final List<CcdEnvironment> SKIPPED_ENVS = List.of(CcdEnvironment.DEMO);

    public HighLevelDataSetupApp(CcdEnvironment dataSetupEnvironment) {
        super(dataSetupEnvironment, definitionsPath);
        logger.info("High level data setup for {} environment", dataSetupEnvironment);
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

        String definitionStoreApiUrl = BeftaMain.getConfig().getDefinitionStoreUrl();
        logger.info("CCD Definition Store API: {}", definitionStoreApiUrl);

        //logger.info("Definitions path: {}", definitionsPath);

        //List<String> definitionFileResources = getAllDefinitionFilesToLoadAt(definitionsPath);

        CcdEnvironment currentEnv = (CcdEnvironment) getDataSetupEnvironment();
        logger.info("Current environment: {}", currentEnv);
        try {
            if (currentEnv != null && !SKIPPED_ENVS.contains(currentEnv)) {
                logger.info("Importing for {} environment", currentEnv);
                importDefinitionsAt(definitionsPath);
            } else {
                logger.info("CCD definition file import skipped for {} environment", currentEnv);
            }
        } catch (Exception e) {
            logger.error("Error when uploading CCD definition files", e);
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
            if (e instanceof AEADBadTagException || e instanceof SSLException) {
                logger.error("Data Setup failure ignored: {}", e.getMessage());
                return true;
            }
        }

        return shouldTolerateDataSetupFailure();
    }
}
