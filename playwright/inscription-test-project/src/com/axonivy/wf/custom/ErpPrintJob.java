package com.axonivy.wf.custom;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;

import ch.ivyteam.ivy.persistence.PersistencyException;
import ch.ivyteam.ivy.process.extension.ui.ExtensionUiBuilder;
import ch.ivyteam.ivy.process.extension.ui.IUiFieldEditor;
import ch.ivyteam.ivy.process.extension.ui.UiEditorExtension;
import ch.ivyteam.ivy.process.intermediateevent.AbstractProcessIntermediateEventBean;

@SuppressWarnings("removal")
public class ErpPrintJob extends AbstractProcessIntermediateEventBean {

  public ErpPrintJob() {
    super("ErpPrintJob", "Waits for ERP reports", File.class);
  }

  @Override
  public void poll() {
    Properties configs = ErpInvoice.createProperties(getConfiguration());
    int seconds = Integer.parseInt(configs.getProperty(Config.INTERVAL, "60"));
    getEventBeanRuntime().setPollTimeInterval(TimeUnit.SECONDS.toMillis(seconds));

    String path = configs.getProperty(Config.PATH, "");
    try (Stream<Path> csv = Files.list(Path.of(path)).filter(f -> f.startsWith("erp-print"))) {
      List<Path> reports = csv.collect(Collectors.toList());
      for (Path report : reports) {
        String fileName = report.getFileName().toString();
        String eventId = StringUtils.substringBefore(fileName, ".pdf");
        continueProcess(report.toFile(), eventId);
      }
    } catch (IOException ex) {
      getEventBeanRuntime().getRuntimeLogLogger().error("Failed to check ERP for updates", ex);
    }
  }

  private void continueProcess(File report, String eventId) {
    try {
      getEventBeanRuntime().fireProcessIntermediateEventEx(eventId, report, "");
    } catch (PersistencyException ex) {
      getEventBeanRuntime().getRuntimeLogLogger().error("Failed to resume process with event" + eventId, ex);
    }
  }

  public static class Editor extends UiEditorExtension {

    private IUiFieldEditor path;
    private IUiFieldEditor interval;

    @Override
    public void initUiFields(ExtensionUiBuilder ui) {
      ui.label("Path to read produced PDF files from:").create();
      path = ui.textField().create();

      ui.label("Interval in seconds to check for changes:").create();
      interval = ui.scriptField().requireType(Integer.class).create();
    }

    @Override
    protected void loadUiDataFromConfiguration() {
      path.setText(getBeanConfigurationProperty(Config.PATH));
      interval.setText(getBeanConfigurationProperty(Config.INTERVAL));
    }

    @Override
    protected boolean saveUiDataToConfiguration() {
      clearBeanConfiguration();
      setBeanConfigurationProperty(Config.PATH, path.getText());
      setBeanConfigurationProperty(Config.INTERVAL, interval.getText());
      return true;
    }
  }

  private interface Config {
    String PATH = "path";
    String INTERVAL = "interval";
  }

}
