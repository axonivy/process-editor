import { IvyIcons } from '@axonivy/ui-icons';
import {
  type AutocompleteSuggestion,
  CenterAction,
  GEdge,
  GLabel,
  GModelElement,
  GModelRoot,
  GNode,
  type IAutocompleteSuggestionProvider,
  SearchAutocompletePalette,
  SelectAction,
  toArray
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { ActivityTypes, EventTypes, GatewayTypes } from '../../diagram/view-types';
import './search-palette.css';

@injectable()
export class IvySearchAutocompletePalette extends SearchAutocompletePalette {
  protected getSuggestionProviders() {
    return [new RevealNodeAutocompleteSuggestionProvider(), new RevealEdgeElementAutocompleteSuggestionProvider()];
  }

  show(root: Readonly<GModelRoot>, ...contextElementIds: string[]): void {
    // customization: Skip deselecting all elements
    this.activeElement = document.activeElement;
    if (!this.containerElement) {
      if (!this.initialize()) return;
    }
    this.onBeforeShow(this.containerElement, root, ...contextElementIds);
    this.setContainerVisible(true);
    this.root = root;
    this.autocompleteWidget.open(root);
  }
}

const iconForType = (type: string) => {
  if (type.startsWith(ActivityTypes.DEFAULT)) {
    return IvyIcons.ActivitiesGroup;
  }
  if (type.startsWith(EventTypes.DEFAULT)) {
    return IvyIcons.Start;
  }
  if (type.startsWith(GatewayTypes.DEFAULT)) {
    return IvyIcons.GatewaysGroup;
  }
  return IvyIcons.PoolSwimlanes;
};

export class RevealNodeAutocompleteSuggestionProvider implements IAutocompleteSuggestionProvider {
  async retrieveSuggestions(root: Readonly<GModelRoot>): Promise<AutocompleteSuggestion[]> {
    return toArray(root.index.all())
      .filter(element => element instanceof GNode)
      .map(node => ({
        element: node,
        action: {
          label: `[${node.type}] - ${this.getNodeLabel(node)}`,
          actions: this.getActions(node),
          icon: `ivy ivy-${iconForType(node.type)}`
        }
      }));
  }
  protected getActions(element: GModelElement) {
    return [
      SelectAction.create({ selectedElementsIDs: [element.id], deselectedElementsIDs: true }),
      CenterAction.create([element.id], { retainZoom: true })
    ];
  }

  protected getNodeLabel(node: GNode) {
    const label = node.children.find(c => c instanceof GLabel);
    return label?.text ? label.text : node.id;
  }
}
export class RevealEdgeElementAutocompleteSuggestionProvider implements IAutocompleteSuggestionProvider {
  async retrieveSuggestions(root: Readonly<GModelRoot>): Promise<AutocompleteSuggestion[]> {
    const edges = toArray(root.index.all().filter(element => element instanceof GEdge)) as GEdge[];
    return edges.map(edge => ({
      element: edge,
      action: {
        label: `[${edge.type}] - ${this.getEdgeLabel(root, edge)}`,
        actions: this.getActions(edge),
        icon: `ivy ivy-${IvyIcons.Straighten}`
      }
    }));
  }

  protected getActions(edge: GEdge) {
    return [
      SelectAction.create({ selectedElementsIDs: [edge.id], deselectedElementsIDs: true }),
      CenterAction.create([edge.sourceId, edge.targetId])
    ];
  }
  protected getEdgeLabel(root: Readonly<GModelRoot>, edge: GEdge): string {
    const label = edge.children.find(c => c instanceof GLabel);
    if (label?.text) {
      return label.text;
    }
    const sourceNode = root.index.getById(edge.sourceId);
    const targetNode = root.index.getById(edge.targetId);
    return sourceNode?.type + ' -> ' + targetNode?.type;
  }
}
