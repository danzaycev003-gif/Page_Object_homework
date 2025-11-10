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
  });

  // Создание статьи
  test.beforeEach(async ({ page }) => {
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

  test('Создание статьи', async ({ page }) => {
    await expect(page.getByText('Содержание')).toBeVisible();
  });

  test('Редактирование статьи', async ({ page }) => {
    await articlePage.goto(articleSlug);
    await articlePage.editArticle();
    
    // Применяем метод updateArticle
    await editorPage.updateArticle('Обновленное название');
    
    await expect(page.getByText('Обновленное название')).toBeVisible();
  });

  // Переход на страницу профиля автора
  test('Переход на страницу профиля автора', async ({ page }) => {
    await mainPage.goto();
    await mainPage.clickGlobalFeed();

    const author = await mainPage.getFirstArticleAuthor();
    await mainPage.openAuthorProfile();

    await expect(page.locator('h4')).toHaveText(author);
    expect(await page.locator('.article-preview').count()).toBeGreaterThan(0);
  });

  // Фильтрация по тегу
  test('Фильтрация статей по тегу', async ({ page }) => {
    await mainPage.goto();
    await mainPage.clickGlobalFeed();

    const tag = await mainPage.getFirstTag();
    await mainPage.clickTag(tag);

    await expect(page.locator('.tag-list')).toContainText(tag);
  });

  // Добавление в избранное
  test('Добавление статьи в избранное', async ({ page }) => {
    await articlePage.goto(articleSlug);
    await articlePage.addToFavorites();

    await expect(articlePage.favoriteButton).toContainText(/Unfavorite|Favorite/);
  });
});
