/* eslint no-unused-expressions: "off" */
/**
 * Due to long loading times, will not reset state of each
 * test but will continue from where the previous test ended
 *
 */
const backToStartButton = '#back-to-start-btn'
const nextChapterButton = '#next-chapter-btn'
const previousChapterButton = '#prev-chapter-btn'
const currentChapterSpan = '#current-chapter-label'
const submitButton = '#submit-questionnaire-btn'

const timeAllowedForProgressBarUpdate = 2000

module.exports = {
  before: function (browser) {
    browser.url(browser.globals.devServerURL)
  },

  after: function (browser) {
    browser.end()
  },

  'should render initial table content correctly': function (browser) {
    // ======= setup =======
    browser.options.desiredCapabilities.name = 'render initial table content correctly'

    // ===== selectors =====
    var tableSelector = 'table'
    var firstRowSelector = 'table > tbody > tr:nth-child(1)'
    var secondRowSelector = 'table > tbody > tr:nth-child(2)'
    var thirdRowSelector = 'table > tbody > tr:nth-child(3)'
    var firstColumnSelector = 'td:nth-child(1)'
    var secondColumnSelector = 'td:nth-child(2)'

    // ======= tests =======
    browser.expect.element(tableSelector).to.be.present

    browser.expect.element(firstRowSelector + ' > ' + firstColumnSelector).text.to.contains('Questionnaire #1')
    browser.expect.element(secondRowSelector + ' > ' + firstColumnSelector).text.to.contains('Questionnaire #2')
    browser.expect.element(thirdRowSelector + ' > ' + firstColumnSelector).text.to.contains('Questionnaire #3')
    browser.expect.element(firstRowSelector + ' > ' + secondColumnSelector).text.to.contains('Not started yet')
    browser.expect.element(secondRowSelector + ' > ' + secondColumnSelector).text.to.contains('Open')
    browser.expect.element(thirdRowSelector + ' > ' + secondColumnSelector).text.to.contains('Submitted')
  },

  'should load start page when button is clicked': function (browser) {
    // ======= setup =======
    browser.options.desiredCapabilities.name = 'load start page when button is clicked'

    // ===== selectors =====
    var firstRowViewButton = 'table > tbody > tr:nth-child(1) > td:nth-child(3) > a'
    var backToQuestionnairesListButton = 'a.btn.btn-sm.btn-outline-secondary.mt-2.router-link-active'
    var startQuestionnaireButton = 'body > div > div > div > button'
    var questionnaireLabelElement = 'h5'
    var questionnaireDescriptionElement = 'p'

    // ======= tests =======
    browser.click(firstRowViewButton)

    browser.expect.element(backToQuestionnairesListButton).to.be.present
    browser.expect.element(startQuestionnaireButton).to.be.present
    browser.expect.element(questionnaireLabelElement).to.be.present
    browser.expect.element(questionnaireDescriptionElement).to.be.present

    browser.expect.element(backToQuestionnairesListButton).text.to.contains('Back to questionnaires list')
    browser.expect.element(startQuestionnaireButton).text.to.contains('Start questionnaire')
    browser.expect.element(questionnaireLabelElement).text.to.contains('Questionnaire #1')
    browser.expect.element(questionnaireDescriptionElement).text.to.contains('This is the first mocked questionnaire response')
  },

  'should load the first chapter when the start questionnaire button is clicked': function (browser) {
    // ======= setup =======
    browser.options.desiredCapabilities.name = 'load the first chapter when the start questionnaire button is clicked'

    // ===== selectors =====
    var startQuestionnaireButton = 'body > div > div > div > button'
    var chapterNavigationHeader = 'ul > a:nth-child(1)'
    var firstChapterListItem = 'ul > a:nth-child(2)'
    var secondChapterListItem = 'ul > a:nth-child(3)'

    // ======= tests =======
    browser.click(startQuestionnaireButton)

    browser.expect.element(backToStartButton).to.be.present
    browser.expect.element(nextChapterButton).to.be.present
    browser.expect.element(currentChapterSpan).to.be.present
    browser.expect.element(chapterNavigationHeader).to.be.present
    browser.expect.element(firstChapterListItem).to.be.present
    browser.expect.element(secondChapterListItem).to.be.present

    browser.expect.element(backToStartButton).text.to.contains('Back to start')
    browser.expect.element(nextChapterButton).text.to.contains('Next chapter')
    browser.expect.element(currentChapterSpan).text.to.contains('Chapter 1 of 2')
    browser.expect.element(chapterNavigationHeader).text.to.contains('Chapters')
    browser.expect.element(firstChapterListItem).text.to.contains('Chapter #1 - Personal information')
    browser.expect.element(secondChapterListItem).text.to.contains('Chapter #2 - Professional questions')
  },

  'should update progress in chapter navigation list when filling in questions': function (browser) {
    // ======= setup =======
    browser.options.desiredCapabilities.name = 'update progress in chapter navigation list when filling in questions'

    // ===== selectors =====
    var chapterOneNameQuestion = '#ch1_question1'
    var chapterOneAgeQuestion = '#ch1_question2'
    var chapterOneRequiredQuestion = '#ch1_question3'
    var chapterOneBoolQuestion = '#ch1_question4-0'
    var chapterOneProgressBar = 'ul > a:nth-child(2) > div > div'

    // ======= tests =======
    browser.expect.element(chapterOneProgressBar).to.have.attribute('aria-valuenow').which.contains('0')

    browser.setValue(chapterOneNameQuestion, 'Nightwatch test')
    browser.pause(timeAllowedForProgressBarUpdate)
    browser.expect.element(chapterOneProgressBar).to.have.attribute('aria-valuenow').which.contains('33')

    browser.setValue(chapterOneAgeQuestion, 20)
    browser.pause(timeAllowedForProgressBarUpdate)
    browser.expect.element(chapterOneProgressBar).to.have.attribute('aria-valuenow').which.contains('67')

    // this question is nillable and should not update progress
    browser.click(chapterOneBoolQuestion)
    browser.pause(timeAllowedForProgressBarUpdate)
    browser.expect.element(chapterOneProgressBar).to.have.attribute('aria-valuenow').which.contains('67')

    browser.setValue(chapterOneRequiredQuestion, 'A nightwatch generated text')
    browser.pause(timeAllowedForProgressBarUpdate)
    browser.expect.element(chapterOneProgressBar).to.have.attribute('aria-valuenow').which.contains('100')

    browser.expect.element(chapterOneProgressBar).to.have.attribute('class').which.contains('bg-success')
  },

  'should navigate to the second chapter': function (browser) {
    // ======= setup =======
    browser.options.desiredCapabilities.name = 'navigate to the second chapter'

    // ===== selectors =====
    var currentChapterSpan = 'body > div > div > div > div:nth-child(2) > div.col-xs-12.col-sm-12.col-md-12.col-lg-9.col-xl-9 > div > div.card-header > div'

    // ======= tests =======
    browser.click(nextChapterButton)

    browser.expect.element(previousChapterButton).to.be.present
    browser.expect.element(currentChapterSpan).to.be.present
    browser.expect.element(submitButton).to.be.present

    browser.expect.element(previousChapterButton).text.to.contains('Previous chapter')
    browser.expect.element(currentChapterSpan).text.to.contains('Chapter 2 of 2')
    browser.expect.element(submitButton).text.to.contains('Submit')
  },

  'should finish questionnaire and submit': function (browser) {
    // ======= setup =======
    browser.options.desiredCapabilities.name = 'finish questionnaire and submit'

    // ===== selectors =====
    var vueCheckbox = '#ch2_question1-0'
    var javascriptCheckbox = '#ch2_question1-3'
    var molgenisWebsiteRadio = '#ch2_question2-0'
    var submissionText = 'p'
    var backToQuestionnairesListButton = 'body > div > div > div > a'
    var tableSelector = 'table'

    // ======= tests =======
    browser.click(vueCheckbox)
    browser.click(javascriptCheckbox)
    browser.click(molgenisWebsiteRadio)
    browser.click(submitButton)

    browser.expect.element(submissionText).to.be.present
    browser.expect.element(backToQuestionnairesListButton).to.be.present

    browser.expect.element(submissionText).text.to.contains('Thank you')
    browser.expect.element(backToQuestionnairesListButton).text.to.contains('Back to questionnaires list')

    browser.click(backToQuestionnairesListButton)
    browser.expect.element(tableSelector).to.be.present
  }
}
