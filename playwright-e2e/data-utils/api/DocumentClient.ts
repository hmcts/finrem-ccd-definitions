import {getServiceToken, getUserToken} from './TokenHelperApi.ts';
import {axiosRequest} from './ApiHelper.ts';

export class DocumentClient {
  constructor(
        private username: string,
        private password: string
  ) {
  }

  private async getHeaders() {
    const [userToken, serviceToken] = await Promise.all([
      getUserToken(this.username, this.password),
      getServiceToken()
    ]);

    return {
      Authorization: `Bearer ${userToken}`,
      ServiceAuthorization: `Bearer ${serviceToken}`
    };
  }

  async getDocumentCookies(documentId: string, cookieHeader: string): Promise<DocumentMetadata> {
    const response = await axiosRequest({
      method: 'get',
      url: `https://manage-case.${process.env.RUNNING_ENV}.platform.hmcts.net/documents/${documentId}`,
      headers: {
        Cookie: cookieHeader
      },
      responseType: 'json'
    });

    return response.data;
  }
}

export type DocumentMetadata = {
    originalDocumentName: string;
    mimeType: string;
    size: number;
    _links: {
        self: { href: string };
        binary: { href: string };
    };
};