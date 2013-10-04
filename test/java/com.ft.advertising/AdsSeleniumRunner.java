package com.ft.advertising;


import com.ft.test.qunit.runner.QunitSeleniumRunner;
import com.thoughtworks.selenium.DefaultSelenium;
import com.thoughtworks.selenium.Selenium;
import org.openqa.selenium.server.SeleniumServer;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Parameters;


public class AdsSeleniumRunner extends QunitSeleniumRunner {

   private SeleniumServer server;
   private Selenium selenium;

    public AdsSeleniumRunner() {
    }

    @BeforeClass(alwaysRun = true)
    @Parameters( { "seleniumHost", "seleniumPort", "browser" })
    public void startServer(String seleniumHost, String seleniumPort, String browser) {
        try {
            server = new SeleniumServer();
            server.start();

            selenium = new DefaultSelenium(seleniumHost, Integer.parseInt(seleniumPort), browser, "http://www.ft.com");
            selenium.start();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @AfterClass
    public void stopServer() {
        try {
            if (selenium != null) {
                selenium.stop();
            }
        } finally {
            if (server != null) {
                server.stop();
            }
        }
    }


}
