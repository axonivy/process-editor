package com.axonivy.wf.custom;

import java.util.List;

import com.axonivy.erp.ErpFileService;

import ch.ivyteam.ivy.environment.Ivy;
import ch.ivyteam.ivy.process.program.activity.AbortableExecution;
import ch.ivyteam.ivy.process.program.activity.ProgramExecutor;
import ch.ivyteam.ivy.process.program.ui.ProgramEditorUi;
import ch.ivyteam.ivy.process.program.ui.ProgramUiBuilder;
import ch.ivyteam.ivy.process.program.ui.select.SelectItem;
import ch.ivyteam.ivy.scripting.objects.File;

public class ErpLoader implements ProgramExecutor, ProgramEditorUi {

  @Override
  public AbortableExecution newExecution() {
    return e -> {
      String path = e.config().get(Config.PATH);
      var statistics = e.script().executeExpression(path, File.class);
      if (statistics.isPresent() && statistics.get().exists()) {
        ErpFileService.instance().reportStats(statistics.get());
      } else {
        Ivy.log().warn("Failed to resolve statistics file from " + path);
      }
    };
  }

  @Override
  public void editor(ProgramUiBuilder ui) {
    ui.label("The CSV statistic to report to Acme.ERP:").create();
    ui.scriptField(Config.PATH).requireType(File.class).create();

    ui.label("File extensions:").create();
    ui.multiSelect(Config.TYPES)
      .items(List.of(
        SelectItem.of("CSV", "CSV", "🪪️", "stable plain text"), 
        SelectItem.of("XLS"),
        SelectItem.of("XLSX")))
      .create();
  }

  private static interface Config {
    String PATH = "path";
    String TYPES = "types";
  }

}
