package finrem.cfv;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;

public class CategoriesAssignDisplayOrder {

    public void assignDisplayOrders() {
        String filePath = "definitions/contested/json/CaseTypeTab/CaseTypeTab.json";

        try {
            // Load the JSON file
            ObjectMapper objectMapper = new ObjectMapper();
            List<LinkedHashMap> jsonData = objectMapper.readValue(new FileReader(filePath), List.class);
            int j = 1;
            for (int i = 0; i < jsonData.size(); i++) {
                LinkedHashMap entry = jsonData.get(i);
                if ("respondentDetailsTab".equals(String.valueOf(entry.get("TabID")))) {
                    entry.put("TabFieldDisplayOrder", (String.valueOf(j)));
                    j += 1;
                }

            }
            // Save the modified and ordered JSON back to the file
            objectMapper.writeValue(new FileWriter(filePath), jsonData);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }


}
