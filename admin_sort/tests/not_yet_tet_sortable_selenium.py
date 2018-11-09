# -*- coding: utf-8 -*-
from time import sleep

from django.conf import settings
from django.contrib.auth.models import User
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.firefox.options import Options

from ckeditor_link.tests.utils.selenium_utils import SeleniumTestCase, CustomWebDriver
from ckeditor_link.tests.test_app.models import TestModel, LinkModel


# compat
import django
if django.VERSION[:2] < (1, 10):
    from django.core.urlresolvers import reverse
else:
    from django.urls import reverse


class ckeditor_linkEditorTests(SeleniumTestCase):
    fixtures = ['data.json', ]
    username = 'admin'
    password = 'admin'

    def setUp(self):
        superuser = User.objects.create_superuser(self.username, 'admin@free.fr', self.password)
        self.existing = TestModel.objects.get(pk=1)
        # Instantiating the WebDriver will load your browser
        options = Options()
        if settings.HEADLESS_TESTING:
            options.add_argument("--headless")
        self.webdriver = CustomWebDriver(firefox_options=options, )

    def tearDown(self):
        self.webdriver.quit()

    def test_app_index_get(self):
        # if this fails, everything is probably broken.
        self.login()
        self.open(reverse('admin:index'))
        self.webdriver.find_css(".app-test_app")

    def test_editor_has_button_dialog_opens_has_form(self):
        self.login()
        self.open(reverse('admin:test_app_testmodel_change', args=[self.existing.id]))
        # wait = WebDriverWait(self.webdriver, 5)
        # element = wait.until(EC.frame_to_be_available_and_switch_to_it((By.CSS_SELECTOR, '.cke_dialog_ui_html')))
        # WebDriverWait(self.webdriver, 4).until(EC.presence_of_element_located(By.CSS_SELECTOR, '.cke_dialog_ui_html'))
        sleep(1)  # #1 may ckeditor be very slow, so the click event is not handled?!
        button = self.webdriver.wait_for_css(".cke_button__djangolink")
        button[0].click()
        dialog_title = self.webdriver.wait_for_css(".cke_dialog_title")
        # sleep(2)  # argh
        iframe = self.webdriver.find_css(".cke_dialog_ui_html")
        self.webdriver.switch_to.frame(iframe)
        target = self.webdriver.wait_for_css("#id_target")