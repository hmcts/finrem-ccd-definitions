package finrem;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import uk.gov.hmcts.befta.BeftaMain;
import uk.gov.hmcts.befta.dse.ccd.CcdEnvironment;
import uk.gov.hmcts.befta.dse.ccd.DataLoaderToDefinitionStore;

import java.util.List;
import java.util.Arrays;

public class HighLevelDataSetupApp extends DataLoaderToDefinitionStore {

    private static final Logger logger = LoggerFactory.getLogger(HighLevelDataSetupApp.class);
    private static final String definitionsPath = "ccd_definition";
    private static final List<CcdEnvironment> SKIPPED_ENVS = Arrays.asList(
            CcdEnvironment.DEMO);

    public HighLevelDataSetupApp(CcdEnvironment dataSetupEnvironment) {
        super(dataSetupEnvironment, definitionsPath);
        logger.info("High level data setup for {} environment", dataSetupEnvironment);
    }

    public static void main(String[] args) throws Throwable {
        main(HighLevelDataSetupApp.class, args);
    }

    @Override
    public void addCcdRoles() {
        logger.info("addCcdRoles");
    }

    @Override
    protected void doLoadTestData() {
        logger.info("doLoadTestData");

        String  definitionStoreApiUrl = BeftaMain.getConfig().getDefinitionStoreUrl();
        logger.info("CCD Definition Store API: {}", definitionStoreApiUrl);

        logger.info("Definitions path: {}", definitionsPath);

        List<String> definitionFileResources = getAllDefinitionFilesToLoadAt(definitionsPath);

        CcdEnvironment currentEnv = (CcdEnvironment) getDataSetupEnvironment();
        logger.info("Current environment: {}", currentEnv);
        try {
            if (currentEnv != null && !SKIPPED_ENVS.contains(currentEnv)) {
                logger.info("Importing for {} environment", currentEnv);
                importDefinitions();
            } else {
                logger.info("Skipping importing for {} environment", currentEnv);
                definitionFileResources.forEach(file ->
                        System.out.println("definition file \"" + file + "\" is skipped on " + currentEnv));
            }
        } catch (Exception e) {
            logger.error("Error when uploading CCD definition files", e);
            System.out.println("Error on uploading ccd definition file - " + e.getMessage());
            // exit the process to fail jenkin pipeline
            System.exit(1);
        }
    }
}
