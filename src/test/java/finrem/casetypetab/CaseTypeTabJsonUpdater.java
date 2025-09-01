package finrem.casetypetab;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Updates the TabDisplayOrder values in contested CaseTypeTab.json.
 * definitions/contested/json/CaseTypeTab/CaseTypeTab.json
 * To use, first set the required values in tab-display-order in the unit test resources.
 * folder `test/unit/resources/tab-display-order.json`
 * The updated json is written to output.json.
 * You will need to copy this manually to CaseTypeTab.json and ensure you reformat it.
 * Use IntelliJ Code->Reformat Code.
 * <br/>
 * Any updates to the TabDisplayOrder will need to be replicated in CaseTypeTab.test.js
 * This test runs as part of the CI build - yarn test
 */
class CaseTypeTabJsonUpdater {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public static void main(String[] args) throws IOException {
        new CaseTypeTabJsonUpdater().updateTabDisplayOrder();
    }

    void updateTabDisplayOrder() throws IOException {
        Map<String, Integer> expectedTabDisplayOrder = getExpectedTabDisplayOrder();
        List<Map<String, Object>> jsonData = getInputData();

        for (Map<String, Object> entry : jsonData) {
            String tabId = (String) entry.get("TabID");

            if (expectedTabDisplayOrder.containsKey(tabId)) {
                Integer tabDisplayOrder = expectedTabDisplayOrder.get(tabId);
                entry.put("TabDisplayOrder", tabDisplayOrder);
            }
        }

        String output = "src/test/java/finrem/casetypetab/output.json";
        objectMapper.writeValue(new FileWriter(output), jsonData);
    }

    private Map<String, Integer> getExpectedTabDisplayOrder() throws IOException {
        String filePath = "test/unit/resources/tab-display-order.json";
        return objectMapper.readValue(new FileReader(filePath), new TypeReference<>() {
        });
    }

    private List<Map<String, Object>> getInputData() throws IOException {
        String filePath = "definitions/contested/json/CaseTypeTab/CaseTypeTab.json";
        return objectMapper.readValue(new FileReader(filePath), new TypeReference<>() {
        });
    }
}
