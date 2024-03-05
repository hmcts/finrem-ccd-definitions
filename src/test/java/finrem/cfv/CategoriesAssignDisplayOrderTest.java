package finrem.cfv;


import org.junit.jupiter.api.Test;

public class CategoriesAssignDisplayOrderTest {

    CategoriesAssignDisplayOrder categoriesAppender = new CategoriesAssignDisplayOrder();

    @Test
    public void shouldAddNewEntryAndReorder(){
        categoriesAppender.assignDisplayOrders();
    }
}
