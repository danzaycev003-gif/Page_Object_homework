export class ArticlePage {

  constructor(page) {
    this.page = page;
    this.articleTitle = page.locator('.container h1');
    this.editArticleButton = page.locator('button:has-text("Edit Article")').first();
    this.deleteArticleButton = page.locator('button:has-text("Delete Article")').first();
    this.commentInput = page.locator('[placeholder="Write a comment..."]');
    this.postCommentButton = page.locator('button:has-text("Post Comment")');
    this.followButton = page.locator('.article-meta button').filter({ hasText: /Follow|Unfollow/ }).first();
    this.favoriteButton = page.locator('.article-meta button').filter({ hasText: /Favorite|Unfavorite/ }).first();
  }

  async goto(slug) {
    await this.page.goto(`https://realworld.qa.guru/#/article/${slug}`);
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
