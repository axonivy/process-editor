package com.axonivy.wf.custom;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import ch.ivyteam.ivy.process.eventstart.IProcessStartEventBean;
import ch.ivyteam.ivy.process.eventstart.IProcessStartEventBeanRuntime;
import ch.ivyteam.ivy.process.extension.ProgramConfig;
import ch.ivyteam.ivy.process.program.ui.ProgramEditorUi;
import ch.ivyteam.ivy.process.program.ui.ProgramUiBuilder;
import ch.ivyteam.ivy.request.RequestException;

public class ErpInvoice implements IProcessStartEventBean, ProgramEditorUi {

  private IProcessStartEventBeanRuntime runtime;
  private String path;

  @Override
  public String getName() {
    return "ErpInvoice";
  }

  @Override
  public String getDescription() {
    return "Integrates ERP updates driven by CSV files";
  }

  @Override
  public void initialize(IProcessStartEventBeanRuntime eventRuntime, ProgramConfig config) {
    try {
      this.runtime = eventRuntime;
      this.path = config.get(Config.PATH);
      String interval = config.get(Config.INTERVAL);
      if (interval != null) {
        eventRuntime.poll().asDefinedByIvyScript(interval);
      }
    } catch (Exception ex) {
      eventRuntime.getRuntimeLogLogger().error("Failed to initialize ErpInvoice polling", ex);
    }
  }

  @Override
  public void poll() {
    try (Stream<Path> csv = Files.list(Path.of(path))) {
      List<Path> updates = csv.collect(Collectors.toList());
      startProcess("new stock items", Map.of("sheets", updates));
    } catch (IOException ex) {
      runtime.getRuntimeLogLogger().error("Failed to check ERP for updates", ex);
    }
  }

  private void startProcess(String firingReason, Map<String, Object> parameters) {
    try {
      runtime.processStarter()
        .withParameters(parameters)
        .withReason(firingReason)
        .start();
    } catch (RequestException ex) {
      runtime.getRuntimeLogLogger().error("Failed to init ERP driven proces", ex);
    }
  }

  @Override
  public void editor(ProgramUiBuilder ui) {
    ui.label("Path to read .CSV stock-item changes:").create();
    ui.textField(Config.PATH).create();
  
    ui.label("Interval in seconds to check for changes:").create();
    ui.scriptField(Config.INTERVAL).requireType(Integer.class).create();
  }

  private interface Config {
    String PATH = "path";
    String INTERVAL = "interval";
  }

}
