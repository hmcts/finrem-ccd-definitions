package finrem.casetypetab;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.Map;

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
        String filePath = "src/test/java/finrem/casetypetab/tab-display-order.json";
        return objectMapper.readValue(new FileReader(filePath), new TypeReference<>() {
        });
    }

    private List<Map<String, Object>> getInputData() throws IOException {
        String filePath = "src/test/java/finrem/casetypetab/input.json";
        return objectMapper.readValue(new FileReader(filePath), new TypeReference<>() {
        });
    }
}
