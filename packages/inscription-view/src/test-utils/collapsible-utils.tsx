import { screen, userEvent } from 'test-utils';
import { expect } from 'vitest';

export namespace CollapsableUtil {
  export async function toggle(byText: string) {
    await userEvent.click(screen.getByText(byText));
  }

  export async function assertClosed(byText: string) {
    expect((await screen.findByText(byText)).parentNode).toHaveAttribute('data-state', 'closed');
  }

  export async function assertOpen(byText: string) {
    const el = screen.getAllByText(byText).find(el => el.closest('.ui-collapsible'));
    if (!el) throw new Error(`No element with text '${byText}' inside a .ui-collapsible`);
    expect(el.closest('.ui-collapsible')).toHaveAttribute('data-state', 'open');
  }
}
