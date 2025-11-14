export class MainPage {
  constructor(page) {
    this.page = page;
    this.globalFeedButton = page.getByText('Global Feed');
    this.articlePreviews = page.locator('.article-preview');
    this.articleAuthors = page.locator('.author');
    this.tags = page.locator('.tag-pill');
    this.tagList = page.locator('.tag-list');
    this.profileHeader = page.locator('h4');
    this.logoutDropdown = page.locator('.nav-link.dropdown-toggle');
    this.settingsLink = page.getByRole('link', { name: 'Settings' });
    this.logoutButton = page.getByText('Or click here to logout', { exact: false });
  }

  async goto() {
    await this.page.goto('https://realworld.qa.guru/#/');
  }

  async clickGlobalFeed() {
    await this.globalFeedButton.click();
  }

  async getFirstArticleAuthor() {
    await this.articlePreviews.first().waitFor({ state: 'visible', timeout: 10000 });
    return await this.articleAuthors.first().innerText();
  }

  async openAuthorProfile() {
    await this.articleAuthors.first().click();
  }

  async getFirstTag() {
    return await this.tags.first().innerText();
  }

  async clickTag(tag) {
    await this.page.getByText(tag).click();
  }

  async logout() {
    await this.logoutDropdown.click();
    await this.settingsLink.click();
    await this.logoutButton.click();
  }
}
