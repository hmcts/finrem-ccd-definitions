import { expect, type Locator, type Page } from '@playwright/test';
import { ConsentedEvents } from '../../config/case-data.ts';
import { DateHelper } from '../../data-utils/DateHelper.ts';
import {
  approvedOrderTabs,
  refusedOrderTabs
} from '../../resources/tab_content/consented/review_application_tabs.ts';
import type { CaseDetailsPage } from '../CaseDetailsPage.ts';
import type { ApproveApplicationPage } from '../events/approve-order/ApproveApplicationPage.ts';
import type { ConsentOrderNotApprovedPage } from '../events/consent-application/ConsentOrderNotApprovedPage.ts';
import type { TaskCompletionAction } from './TaskScenario.ts';
import type { TaskManagementAction } from './TaskTypes.ts';
import type { TaskUiChecks } from './TaskUiChecks.ts';

export const REVIEW_APPLICATION_TASK = 'Review Application';
export const APPROVE_APPLICATION = 'Approve Application';
export const UPLOAD_APPROVED_ORDER = 'Upload Approved Order';
export const APPLICATION_NOT_APPROVED = 'Application Not Approved';

const REFUSAL_REASON = 'The D81 form is incomplete';

// The judge's title and surname, typed into the order.
export type OrderJudge = {
  judgeTitle: string;
  surname: string;
};

export type ReviewTaskActions = {
  unassignedActions: readonly TaskManagementAction[];
  assignedActions: readonly TaskManagementAction[];
};

export type ActionOptions = { checkOthersHidden?: boolean };

// Steps a judge takes on the consented Review Application task from the case
// Tasks tab: check and assign the task, then complete it with a next step
// event or a task management action.
export class ReviewApplicationTask {

  // Anchored, so it doesn't also match the Payment History tab. The selected
  // tab's name has keyboard help after a comma ("History, Please use ...").
  private readonly historyTab: Locator;

  public constructor(
    page: Page,
    private readonly taskUiChecks: TaskUiChecks,
    private readonly caseDetailsPage: CaseDetailsPage,
    private readonly approveApplicationPage: ApproveApplicationPage,
    private readonly consentOrderNotApprovedPage: ConsentOrderNotApprovedPage
  ) {
    this.historyTab = page.getByRole('tab', { name: /^History(,|$)/ });
  }

  // Checks the unassigned task, assigns it to the judge and checks the
  // management actions and next steps. The case must be open.
  async assertAndAssign(actions: ReviewTaskActions, options: ActionOptions = {}): Promise<void> {
    await this.taskUiChecks.navigateToTasks();
    await this.taskUiChecks.assertJudicialTaskUI(
      {
        name: REVIEW_APPLICATION_TASK,
        taskCreated: DateHelper.getFormattedDateAfterWorkingDays(0),
        assignedTo: 'Unassigned'
      },
      actions.unassignedActions,
      options
    );
    await this.taskUiChecks.assignTaskToMe();

    await this.taskUiChecks.assertOnlyManagementActions(actions.assignedActions, options);
    await this.taskUiChecks.assertNextStepVisible(APPROVE_APPLICATION);
    await this.taskUiChecks.assertNextStepVisible(UPLOAD_APPROVED_ORDER);
    await this.taskUiChecks.assertNextStepVisible(APPLICATION_NOT_APPROVED);
  }

  // Completes the task, then checks the case state (on the History tab), that
  // the task has gone from the Tasks tab and the order created on the case.
  async completeAndCheckClosed(
    action: TaskCompletionAction,
    judge: OrderJudge,
    expectedState: string
  ): Promise<void> {
    await this.complete(action, judge);
    await this.openHistoryTab();
    await this.caseDetailsPage.validateCaseState(expectedState);
    await this.taskUiChecks.navigateToTasks();
    await this.taskUiChecks.assertTaskNotVisible(REVIEW_APPLICATION_TASK);
    // Last, because opening the order tabs scrolls the Tasks tab out of view.
    await this.assertOrderOnCase(action, judge);
  }

  // Completes the task with a task management action or a next step event.
  async complete(action: TaskCompletionAction, judge: OrderJudge): Promise<void> {
    switch (action) {
    case 'Mark as done':
      await this.taskUiChecks.markTaskAsDone();
      return;

    case 'Cancel task':
      await this.taskUiChecks.cancelTask();
      return;

    case APPROVE_APPLICATION:
      await this.taskUiChecks.selectTaskNextStep(APPROVE_APPLICATION);
      await this.approveApplicationPage.completeApproveApplication({
        subjectToDecreeAbsolute: false,
        servePensionProvider: true,
        pensionProviderResponsibility: 'The Court',
        judgeTitle: judge.judgeTitle,
        judgeName: judge.surname
      });
      await this.caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.approveApplication.listItem);
      return;

    case UPLOAD_APPROVED_ORDER:
      await this.taskUiChecks.selectTaskNextStep(UPLOAD_APPROVED_ORDER);
      await this.approveApplicationPage.completeUploadApprovedOrder({
        subjectToDecreeAbsolute: false,
        servePensionProvider: false,
        judgeTitle: judge.judgeTitle,
        judgeName: judge.surname,
        // A duplicate file name leaves the task open (DFR-5924), so keep it unique.
        fileName: `approved-order-${Date.now()}.pdf`
      });
      await this.caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.uploadApprovedOrder.listItem);
      return;

    case APPLICATION_NOT_APPROVED:
      await this.taskUiChecks.selectTaskNextStep(APPLICATION_NOT_APPROVED);
      await this.consentOrderNotApprovedPage.completeApplicationNotApproved({
        reasons: [REFUSAL_REASON],
        judgeTitle: judge.judgeTitle,
        judgeName: judge.surname
      });
      await this.caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.orderRefusal.listItem);
      return;

    default:
      throw new Error(`Unsupported completion action: ${action}`);
    }
  }

  // Checks the order a next step event created. Mark as done and Cancel task
  // create no order; the unchanged case state is their outcome.
  private async assertOrderOnCase(action: TaskCompletionAction, judge: OrderJudge): Promise<void> {
    if (action === APPROVE_APPLICATION || action === UPLOAD_APPROVED_ORDER) {
      await this.caseDetailsPage.assertTabData(approvedOrderTabs(judge.surname));
    } else if (action === APPLICATION_NOT_APPROVED) {
      await this.caseDetailsPage.assertTabData(refusedOrderTabs(REFUSAL_REASON, judge.surname));
    }
  }

  private async openHistoryTab(): Promise<void> {
    await expect(this.historyTab).toBeVisible();
    await this.historyTab.click();
    await expect(this.historyTab).toHaveAttribute('aria-selected', 'true');
  }
}
