package com.axonivy.wf.custom;

import com.axonivy.erp.ErpFileService;

import ch.ivyteam.ivy.process.engine.IRequestId;
import ch.ivyteam.ivy.process.extension.impl.AbstractUserProcessExtension;
import ch.ivyteam.ivy.process.extension.ui.ExtensionUiBuilder;
import ch.ivyteam.ivy.process.extension.ui.IUiFieldEditor;
import ch.ivyteam.ivy.process.extension.ui.UiEditorExtension;
import ch.ivyteam.ivy.scripting.language.IIvyScriptContext;
import ch.ivyteam.ivy.scripting.objects.CompositeObject;
import ch.ivyteam.ivy.scripting.objects.File;

@SuppressWarnings("removal")
public class ErpLoader extends AbstractUserProcessExtension {

  @Override
  public CompositeObject perform(IRequestId requestId, CompositeObject in, IIvyScriptContext context) throws Exception {

    String pathScript = getConfigurationProperty(Config.PATH);
    File statistics = (File) executeIvyScript(context, pathScript);
    if (statistics.exists()) {
      ErpFileService.instance().reportStats(statistics);
    } else {
      getLog(context).warn("Failed to resolve statistics file from " + pathScript);
    }

    return in;
  }

  public static class Editor extends UiEditorExtension {

    private IUiFieldEditor filePath;

    @Override
    public void initUiFields(ExtensionUiBuilder ui) {
      ui.label("The CSV statistic to report to Acme.ERP:").create();
      filePath = ui.scriptField().requireType(File.class).create();
    }

    @Override
    protected void loadUiDataFromConfiguration() {
      filePath.setText(getBeanConfigurationProperty(Config.PATH));
    }

    @Override
    protected boolean saveUiDataToConfiguration() {
      clearBeanConfiguration();
      setBeanConfigurationProperty(Config.PATH, filePath.getText());
      return true;
    }
  }

  private static interface Config {
    String PATH = "path";
  }

}
