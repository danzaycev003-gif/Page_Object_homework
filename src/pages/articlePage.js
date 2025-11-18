export class ArticlePage {
  constructor(page) {
    this.page = page;

    // Основные элементы
    this.articleTitle = page.locator('.container h1');
    this.articleContent = page.locator('.article-content');

    // уточняем, что кнопки берём из первого блока article-meta
    this.articleMeta = page.locator('.article-meta').first();
    this.editArticleButton = this.articleMeta.locator('button', { hasText: 'Edit Article' });
    this.deleteArticleButton = this.articleMeta.locator('button', { hasText: 'Delete Article' });
    this.followButton = this.articleMeta.locator('button', { hasText: /Follow|Unfollow/ });
    this.favoriteButton = this.articleMeta.locator('button', { hasText: /Favorite|Unfavorite/ });

    // Комментарии
    this.commentInput = page.getByPlaceholder('Write a comment...');
    this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });
  }

  async goto(slug) {
    await this.page.goto(`https://realworld.qa.guru/#/article/${slug}`);
    await this.articleMeta.waitFor({ state: 'visible' });
  }

  async editArticle() {
    await this.editArticleButton.click();
  }

  async deleteArticle() {
    this.page.once('dialog', dialog => dialog.accept());
    await this.deleteArticleButton.click();
    await this.page.waitForURL('https://realworld.qa.guru/#/');
  }

  async followAuthor() {
    await this.followButton.click();
  }

  async addToFavorites() {
    await this.favoriteButton.click();
  }
}

