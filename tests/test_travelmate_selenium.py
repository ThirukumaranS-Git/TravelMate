import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

BASE = os.getenv('TRAVELMATE_URL','http://127.0.0.1:5500/frontend/index.html')

def test_home_and_planner():
    options=Options(); options.add_argument('--headless=new'); options.add_argument('--window-size=1280,900')
    driver=webdriver.Chrome(options=options)
    try:
        driver.get(BASE)
        assert 'TravelMate' in driver.title
        driver.find_element(By.CSS_SELECTOR,'a[data-route="planner"]').click()
        assert 'Smart Trip Planner' in driver.page_source
        driver.find_element(By.ID,'tripDate').send_keys('10102026')
        driver.find_element(By.CSS_SELECTOR,'#tripForm button[type="submit"]').click()
        assert 'Your itinerary' in driver.page_source
    finally:
        driver.quit()
