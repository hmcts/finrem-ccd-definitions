import config from "../../config/config.ts";
import {CaseTypeEnum} from "../../pages/helpers/enums/RadioEnums.ts";
import {axiosRequest} from "./ApiHelper.ts";
import {getServiceToken, getUserId, getUserToken} from "./TokenHelperApi.ts";


export class CaseAssignmentApi {

    async assignCaseTo(
        orgCredential: { email:string, password:string },
        userToAssign: { email:string, password:string },
        caseId: string,
        caseType: CaseTypeEnum
        ): Promise<void> {

        const caseAssignmentUrl = `${config.manageOrgAPIBaseURL}/case-assignments`;
        const orgAuthToken = await getUserToken(orgCredential.email, orgCredential.password);
        const userAuthToken = await getUserToken(userToAssign.email, userToAssign.password);

        const userId = await getUserId(userAuthToken, userToAssign.email);
        const serviceToken = await getServiceToken();

        const assignCaseResponse = await axiosRequest({
            method: 'POST',
            url: caseAssignmentUrl,
            headers: {
                'Authorization': ` Bearer ${orgAuthToken}`,
                'ServiceAuthorization': `Bearer ${serviceToken}`,
                'Content-Type': 'application/json'
            },
            data: {
                case_id: caseId,
                case_type_id: caseType,
                assignee_id: userId
            }
        });

        if (
            !assignCaseResponse.data.status_message?.includes(
                "from the organisation policies successfully assigned to the assignee"
            )
        ) {
            throw new Error(
                `Failed to assign case ${caseId} to user ${userToAssign.email}. Response: ${JSON.stringify(assignCaseResponse.data)}`
            );
        }
    }

    /**
     * Assigns a case to the applicant's CAA and solicitor.
     * @param caseId - The ID of the case to assign.
     * @param caseType - The type of the case, default is CaseTypeEnum.CONTESTED.
     */
    async assignCaseToApplicant(
        caseId: string,
        caseType: CaseTypeEnum = CaseTypeEnum.CONTESTED
    ): Promise<void> {
        await this.assignCaseTo(config.applicantCAA, config.applicant_solicitor, caseId, caseType);
    }

    /**
     * Assigns a case to the respondent's CAA and solicitor.
     * @param caseId - The ID of the case to assign.
     * @param caseType - The type of the case, default is CaseTypeEnum.CONTESTED.
     */
    async assignCaseToRespondent(
        caseId: string,
        caseType: CaseTypeEnum = CaseTypeEnum.CONTESTED
    ): Promise<void> {
        await this.assignCaseTo(config.respondentCAA, config.respondent_solicitor, caseId, caseType);
    }
}
