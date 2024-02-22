package finrem;

import uk.gov.hmcts.befta.dse.ccd.CcdEnvironment;
import uk.gov.hmcts.befta.dse.ccd.DataLoaderToDefinitionStore;
import uk.gov.hmcts.befta.exception.ImportException;

import java.util.List;
import java.util.Arrays;

public class HighLevelDataSetupApp extends DataLoaderToDefinitionStore {
    private static final String definitionsPath = "ccd_definition";
    private static final List<CcdEnvironment> SKIPPED_ENVS = Arrays.asList(
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
        System.out.println("Testing---------------------------------failed scenario");
        List<String> definitionFileResources = getAllDefinitionFilesToLoadAt(definitionsPath);
        CcdEnvironment currentEnv = (CcdEnvironment) getDataSetupEnvironment();
        try {
            if (currentEnv != null && !SKIPPED_ENVS.contains(currentEnv)) {
                importDefinitions();
            } else {
                definitionFileResources.forEach(file ->
                        System.out.println("definition file \"" + file + "\" is skipped on " + currentEnv));
            }
        } catch(Exception e) {
            throw e;
        }
    }
}
