package finrem.cfv;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Updates the DisplayOrder values in contested Categories.json.
 *
 * Input:
 * definitions/contested/json/Categories/Categories.json
 *
 * To use, first set the required values in:
 * test/unit/resources/category-display-order.json
 *
 * The updated JSON is written to:
 * src/test/java/finrem/cfv/output.json
 *
 * Copy the output manually to Categories.json and reformat it.
 */
public class CategoriesAssignDisplayOrder {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public static void main(String[] args) throws IOException {
        new CategoriesAssignDisplayOrder().updateCategoryDisplayOrder();
    }

    void updateCategoryDisplayOrder() throws IOException {
        Map<String, Integer> expectedDisplayOrder = getExpectedDisplayOrder();
        List<Map<String, Object>> jsonData = getInputData();

        for (Map<String, Object> entry : jsonData) {
            String categoryId = (String) entry.get("CategoryID");

            if (expectedDisplayOrder.containsKey(categoryId)) {
                Integer displayOrder = expectedDisplayOrder.get(categoryId);
                entry.put("DisplayOrder", String.valueOf(displayOrder));
            }
        }

        String output = "src/test/java/finrem/cfv/output.json";
        objectMapper.writeValue(new FileWriter(output), jsonData);
    }

    private Map<String, Integer> getExpectedDisplayOrder() throws IOException {
        String filePath = "test/unit/resources/category-display-order.json";

        return objectMapper.readValue(
                new FileReader(filePath),
                new TypeReference<>() {
                }
        );
    }

    private List<Map<String, Object>> getInputData() throws IOException {
        String filePath = "definitions/contested/json/Categories/Categories.json";

        return objectMapper.readValue(
                new FileReader(filePath),
                new TypeReference<>() {
                }
        );
    }
}
