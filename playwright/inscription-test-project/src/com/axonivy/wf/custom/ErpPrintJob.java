package com.axonivy.wf.custom;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;

import ch.ivyteam.ivy.persistence.PersistencyException;
import ch.ivyteam.ivy.process.extension.ProgramConfig;
import ch.ivyteam.ivy.process.intermediateevent.IProcessIntermediateEventBean;
import ch.ivyteam.ivy.process.intermediateevent.IProcessIntermediateEventBeanRuntime;
import ch.ivyteam.ivy.process.program.ui.ProgramEditorUi;
import ch.ivyteam.ivy.process.program.ui.ProgramUiBuilder;

public class ErpPrintJob implements IProcessIntermediateEventBean, ProgramEditorUi {

  private IProcessIntermediateEventBeanRuntime runtime;
  private String path;

  @Override
  public String getName() {
    return "ErpPrintJob";
  }

  @Override
  public String getDescription() {
    return "Waits for ERP reports";
  }

  @Override
  public Class<?> getResultObjectClass() {
    return File.class;
  }

  @Override
  public void initialize(IProcessIntermediateEventBeanRuntime eventRuntime, ProgramConfig config) {
    try {
      this.runtime = eventRuntime;
      this.path = config.get(Config.PATH);
      String interval = config.get(Config.INTERVAL);
      if (interval != null) {
        eventRuntime.poll().asDefinedByIvyScript(interval);
      }
    } catch (Exception ex) {
      eventRuntime.getRuntimeLogLogger().error("Failed to initialize ErpPrintJob polling", ex);
    }
  }

  @Override
  public void poll() {
    try (Stream<Path> csv = Files.list(Path.of(path)).filter(f -> f.getFileName().toString().startsWith("erp-print"))) {
      List<Path> reports = csv.collect(Collectors.toList());
      for (Path report : reports) {
        String fileName = report.getFileName().toString();
        String eventId = StringUtils.substringBefore(fileName, ".pdf");
        continueProcess(report.toFile(), eventId);
      }
    } catch (IOException ex) {
      runtime.getRuntimeLogLogger().error("Failed to check ERP for updates", ex);
    }
  }

  private void continueProcess(File report, String eventId) {
    try {
      runtime.fireProcessIntermediateEventEx(eventId, report, "");
    } catch (PersistencyException ex) {
      runtime.getRuntimeLogLogger().error("Failed to resume process with event" + eventId, ex);
    }
  }
  
  @Override
  public void editor(ProgramUiBuilder ui) {
    ui.label("Path to read produced PDF files from:").create();
    ui.textField(Config.PATH).create();

    ui.label("Interval in seconds to check for changes:").create();
    ui.scriptField(Config.INTERVAL).requireType(Integer.class).create();
  }

  private interface Config {
    String PATH = "path";
    String INTERVAL = "interval";
  }

}
