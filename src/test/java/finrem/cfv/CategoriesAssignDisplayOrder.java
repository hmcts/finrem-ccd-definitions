package finrem.cfv;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;

public class CategoriesAssignDisplayOrder {

    public void assignDisplayOrders() {
        String filePath = "src/test/java/finrem/cfv/CategoriesToReassign.json";

        try {
            // Load the JSON file
            ObjectMapper objectMapper = new ObjectMapper();
            List<LinkedHashMap> jsonData = objectMapper.readValue(new FileReader(filePath), List.class);

            for (int i = 0; i < jsonData.size(); i++) {
                LinkedHashMap entry = jsonData.get(i);
                entry.put("DisplayOrder", (String.valueOf(i + 1)));

            }
            // Save the modified and ordered JSON back to the file
            objectMapper.writeValue(new FileWriter(filePath), jsonData);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }


}
