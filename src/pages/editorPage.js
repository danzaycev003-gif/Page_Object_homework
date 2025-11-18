export class EditorPage {
  constructor(page) {
    this.page = page;
    this.titleInput = page.getByPlaceholder('Article Title');
    this.descriptionInput = page.getByPlaceholder("What's this article about?");
    this.contentInput = page.getByPlaceholder('Write your article (in markdown)');
    this.tagsInput = page.getByPlaceholder('Enter tags');
    this.publishButton = page.getByRole('button', { name: 'Publish Article' });
    this.updateButton = page.getByRole('button', { name: 'Update Article' });
  }

  async goto() {
    await this.page.goto('https://realworld.qa.guru/#/editor');
    await this.page.waitForSelector('[placeholder="Article Title"]');
  }

  async createArticle(title, description, content, tags) {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.contentInput.fill(content);
    await this.tagsInput.fill(tags);
    await this.publishButton.click();
    await this.page.waitForURL(/\/article\//);
    return this.page.url().split('/article/')[1];
  }

  async updateArticle(newTitle) {
    await this.titleInput.fill(newTitle);
    await this.updateButton.click();
  }
}
