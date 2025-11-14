import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/loginPage';
import { EditorPage } from '../src/pages/editorPage';
import { ArticlePage } from '../src/pages/articlePage';
import { MainPage } from '../src/pages/mainPage';

test.describe('Тесты с авторизацией', () => {
  let loginPage;
  let editorPage;
  let articlePage;
  let mainPage;
  let articleSlug = '';
  let commentText = '';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    editorPage = new EditorPage(page);
    articlePage = new ArticlePage(page);
    mainPage = new MainPage(page);

  // Вход
    await loginPage.goto();
    await loginPage.login('sasha.ahsas987@mail.ru', 'KoniSpringerDLSS28(');

  // Создание и редактирование новой статьи
    await editorPage.goto();
    const timestamp = Date.now();
    const testTitle = `Тестовая статья ${timestamp}`;

    articleSlug = await editorPage.createArticle(
      testTitle,
      `Описание ${timestamp}`,
      `Содержание ${timestamp}`,
      `тег${timestamp}`
    );
  });

  test('Создание статьи', async () => {
    await expect(articlePage.articleContent).toBeVisible();
    await expect(articlePage.articleTitle).toBeVisible();
  });

  test('Редактирование статьи', async () => {
    await articlePage.goto(articleSlug);
    await articlePage.editArticle();

    await editorPage.updateArticle('Обновленное название');
    await expect(articlePage.articleTitle).toHaveText('Обновленное название');
  });

// Переход на страницу автора
  test('Переход на страницу профиля автора', async () => {
    await mainPage.goto();
    await mainPage.clickGlobalFeed();

    const author = await mainPage.getFirstArticleAuthor();
    await mainPage.openAuthorProfile();

    await expect(mainPage.profileHeader).toHaveText(author);
    expect(await mainPage.articlePreviews.count()).toBeGreaterThan(0);
  });

// Фильтрация по тегу
  test('Фильтрация статей по тегу', async () => {
    await mainPage.goto();
    await mainPage.clickGlobalFeed();

    const tag = await mainPage.getFirstTag();
    await mainPage.clickTag(tag);

    await expect(mainPage.tagList).toContainText(tag);
  });

// Добавление в избранное
  test('Добавление статьи в избранное', async () => {
    await articlePage.goto(articleSlug);
    await articlePage.addToFavorites();

    await expect(articlePage.favoriteButton).toContainText(/Unfavorite|Favorite/);
  });
});
