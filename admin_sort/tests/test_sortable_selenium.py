# -*- coding: utf-8 -*-
import os
from time import sleep

from django.conf import settings
from django.contrib.auth.models import User
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.select import Select

from .utils.selenium_utils import SeleniumTestCase, CustomWebDriver
from .testapp.models import SortableBook, Chapter

# compat
import django
if django.VERSION[:2] < (1, 10):
    from django.core.urlresolvers import reverse
else:
    from django.urls import reverse


class SortableFrontendTests(SeleniumTestCase):
    fixtures = ['data.json', ]
    username = 'admin'
    password = 'admin'

    def setUp(self):
        User.objects.create_superuser(self.username, 'admin@free.fr', self.password)
        # Instantiating the WebDriver will load your browser
        options = Options()
        if settings.HEADLESS_TESTING:
            options.add_argument("--headless")
        self.webdriver = CustomWebDriver(firefox_options=options, )

    def tearDown(self):
        self.webdriver.quit()

    def assertUniqueOrderValues(self, queryset):
        """
        always starting at 1!
        :return:
        """
        val = 0
        for obj in queryset:
            val += 1
            self.assertEqual(obj.my_order, val, 'Inconsistent order value on %s' % queryset)

    def test_app_index_get(self):
        # if this fails, everything is probably broken.
        self.login()
        self.open(reverse('admin:index'))
        self.webdriver.find_css(".app-testapp")

    def test_basic_changelist_dndrop_sort(self):
        """
        as of 2018-11-15, this does not work, because selenium and html5 dndrop api
        https://github.com/RubaXa/Sortable/issues/563
        --
        selenium infos
        https://stackoverflow.com/questions/29381233/how-to-simulate-html5-drag-and-drop-in-selenium-webdriver/29381532#29381532
        https://gist.github.com/druska/624501b7209a74040175 # native
        https://github.com/html-dnd/html-dnd  # native, but yarn/npm
        https://gist.github.com/rcorreia/2362544  # jquery
        """
        return
        first_pk = SortableBook.objects.get(my_order=1).pk
        second_pk = SortableBook.objects.get(my_order=2).pk
        self.login()
        self.open(reverse('admin:testapp_sortablebook_changelist'))
        sleep(2)

        # action achains, still not working!
        # dragged = self.webdriver.wait_for_css(".row1 .admin-sort-drag")
        # target = self.webdriver.find_css(".row2")
        # action_chains = ActionChains(self.webdriver)
        # action_chains.drag_and_drop(dragged[0], dragged[1]).perform()
        # action_chains.drag_and_drop_by_offset(dragged[0], 0, 20).perform()
        # action_chains.click_and_hold(dragged[0]).move_to_element(target[0]).perform()
        # action_chains.click_and_hold(dragged[0]).move_by_offset(3, 3).release().perform()

        # try with helper
        # doesnt work. probably needs more work, on events, targets, etc...
        # wait for selenium, yap?!
        with open(os.path.join(settings.APP_ROOT, 'tests', 'utils', 'drag_and_drop_helper.js')) as f:
            js = f.read()
        source = "var source = document.querySelector('.row1');"
        target = "var target = document.querySelector('.row1:nth-child(3)');"
        self.webdriver.execute_script(js + source + target + ' simulateDragDrop(source, target);')
        sleep(2)
        self.assertEqual(SortableBook.objects.get(pk=first_pk).my_order, 2)
        self.assertEqual(SortableBook.objects.get(pk=second_pk).my_order, 1)

    def test_basic_inline_dndrop_sort(self):
        pass

    def test_basic_inline_dropdown_sort(self):
        book_pk = 1
        first_pk = Chapter.objects.get(another_order=1, another_book=book_pk).pk
        second_pk = Chapter.objects.get(another_order=2, another_book=book_pk).pk
        self.login()
        self.open(reverse('admin:testapp_anothersortablebook_change', args=[book_pk, ]))
        chapter_select = Select(self.webdriver.find_css('[name="chapter_set-0-another_order"]'))
        chapter_select.select_by_value("2")
        # chapter_select = self.webdriver.find_css('[name="chapter_set-0-another_order"]')
        # chapter_select.click()
        # self.webdriver.find_css('[name="chapter_set-0-another_order"] option[value="3"]').click()
        self.webdriver.find_css('.submit-row input[name="_save"]').click()
        self.assertEqual(Chapter.objects.get(pk=first_pk).another_order, 2)
        self.assertEqual(Chapter.objects.get(pk=second_pk).another_order, 1)
