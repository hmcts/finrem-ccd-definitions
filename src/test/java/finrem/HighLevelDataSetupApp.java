package finrem;

import uk.gov.hmcts.befta.TestAutomationConfig;
import uk.gov.hmcts.befta.dse.ccd.CcdEnvironment;
import uk.gov.hmcts.befta.dse.ccd.DataLoaderToDefinitionStore;

import java.util.*;

public class HighLevelDataSetupApp extends DataLoaderToDefinitionStore {
    private static final String definitionsPath = "ccd_definition";

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
        System.out.println(TestAutomationConfig.INSTANCE.getDefinitionStoreUrl()
                + " definition file is skipped on " +
                 getDataSetupEnvironment());
        //importDefinitions();
    }
}
