export class MainPage {

    constructor(page) {
        this.page = page;
        this.globalFeedTab = page.locator('button:has-text("Global Feed")');
        this.articlePreview = page.locator('.article-preview');
    }

    async goto() {
        await this.page.goto('https://realworld.qa.guru/#/');
    }

    async clickGlobalFeed() {
        await this.globalFeedTab.click();
        await this.page.getByText('Global Feed').click();
    }

    async getFirstArticle() {
        return this.articlePreview.first();
    }

    async likeFirstArticle() {
        const article = await this.getFirstArticle();
        const likeButton = article.locator('button.btn-outline-primary');
        await likeButton.click();
        return likeButton.locator('.counter');
    }
    
    async getFirstArticleAuthor() {
     await this.page.locator('.article-preview').first().waitFor({ state: 'visible', timeout: 10000 });
     return await this.page.locator('.author').first().innerText();
  }

  async openAuthorProfile() {
    await this.page.locator('.author').first().click();
  }
  async getFirstTag() {
    return await this.page.locator('.tag-pill').first().innerText();
  }

  async clickTag(tag) {
    await this.page.getByText(tag).click();
  }

  async logout() {
    await this.page.locator('.nav-link.dropdown-toggle').click();
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await this.page.getByText('Or click here to logout', { exact: false }).click();
  }

}