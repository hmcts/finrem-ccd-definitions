package finrem;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import uk.gov.hmcts.befta.dse.ccd.CcdEnvironment;
import uk.gov.hmcts.befta.dse.ccd.DataLoaderToDefinitionStore;

import java.util.List;

public class HighLevelDataSetupApp extends DataLoaderToDefinitionStore {
    private static final Logger logger = LoggerFactory.getLogger(HighLevelDataSetupApp.class);
    private static final String definitionsPath = "ccd_definition";
    private static final List<CcdEnvironment> SKIPPED_ENVS = List.of(
            CcdEnvironment.DEMO);

    public HighLevelDataSetupApp(CcdEnvironment dataSetupEnvironment) {
        super(dataSetupEnvironment, definitionsPath);
    }

    public static void main(String[] args) throws Throwable {
        main(HighLevelDataSetupApp.class, args);
    }

    @Override
    protected boolean shouldTolerateDataSetupFailure() {
        return true;
    }

    @Override
    protected void doLoadTestData() {
        logger.info("Definition path: {}", definitionsPath);
        List<String> definitionFileResources = getAllDefinitionFilesToLoadAt(definitionsPath);
        CcdEnvironment currentEnv = (CcdEnvironment) getDataSetupEnvironment();
        try {
            if (currentEnv != null && !SKIPPED_ENVS.contains(currentEnv)) {
                importDefinitions();
            } else {
                definitionFileResources.forEach(file ->
                        System.out.println("definition file \"" + file + "\" is skipped on " + currentEnv));
            }
        } catch (Exception e) {
            System.out.println("Error on uploading ccd definition file - " + e.getMessage());
            // exit the process to fail jenkin pipeline
            System.exit(1);
        }
    }
}
