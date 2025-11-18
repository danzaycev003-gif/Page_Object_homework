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

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    editorPage = new EditorPage(page);
    articlePage = new ArticlePage(page);
    mainPage = new MainPage(page);

    await loginPage.goto();
    await loginPage.login('sasha.ahsas987@mail.ru', 'KoniSpringerDLSS28(');
  });

  // создание и редактирование статьи
  test('Создание статьи', async () => {
    await editorPage.goto();

    const timestamp = Date.now();
    const title = `Тестовая статья ${timestamp}`;
    const description = `Описание ${timestamp}`;
    const body = `Содержание ${timestamp}`;
    const tag = `тег${timestamp}`;

    articleSlug = await editorPage.createArticle(title, description, body, tag);
    await articlePage.goto(articleSlug);

    await expect(articlePage.articleTitle).toHaveText(title);
    await expect(articlePage.articleContent).toContainText(body);
  });

  test('Редактирование статьи', async () => {
    await editorPage.goto();

    const timestamp = Date.now();
    const title = `Статья для редактирования ${timestamp}`;

    articleSlug = await editorPage.createArticle(
      title,
      `Описание ${timestamp}`,
      `Содержимое ${timestamp}`,
      `тег${timestamp}`
    );

    await articlePage.goto(articleSlug);
    await articlePage.editArticle();

    const updatedTitle = 'Обновленное название';
    await editorPage.updateArticle(updatedTitle);

    await expect(articlePage.articleTitle).toHaveText(updatedTitle);
  });

  // добавление в избранное
  test('Добавление статьи в избранное', async () => {
    await editorPage.goto();

    const timestamp = Date.now();
    const title = `Статья избранное ${timestamp}`;

    articleSlug = await editorPage.createArticle(
      title,
      `Описание ${timestamp}`,
      `Текст ${timestamp}`,
      `тег${timestamp}`
    );

    await articlePage.goto(articleSlug);
    await articlePage.addToFavorites();

    await expect(articlePage.favoriteButton).toContainText(/Unfavorite|Favorite/);
  });

  // Переход на профиль автора
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
});

