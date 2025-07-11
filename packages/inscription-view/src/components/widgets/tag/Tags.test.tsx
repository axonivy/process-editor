import { customRender, screen, userEvent, waitFor } from 'test-utils';
import { describe, expect, test } from 'vitest';
import Tags from './Tags';

describe('Tags', () => {
  function renderTags(): {
    data: () => string[];
    rerender: () => void;
  } {
    let tags: string[] = [];
    userEvent.setup();
    const view = customRender(
      <Tags
        tags={['test', 'bla']}
        availableTags={['demo', 'deprecated']}
        onChange={newTags => (tags = newTags)}
        customValues={true}
        allowSpaces={false}
      />
    );
    return {
      data: () => tags,
      rerender: () =>
        view.rerender(
          <Tags
            tags={tags}
            availableTags={['demo', 'deprecated']}
            onChange={newTags => (tags = newTags)}
            customValues={true}
            allowSpaces={false}
          />
        )
    };
  }

  function assertTags(expectedTags: string[]): Promise<void> {
    return waitFor(() => {
      const tags = screen.getAllByRole('gridcell');
      expect(tags).toHaveLength(expectedTags.length);
      expectedTags.forEach((expectedTag, index) => {
        expect(tags[index]).toHaveTextContent(expectedTag);
      });
    });
  }

  test('tags will render', async () => {
    renderTags();
    await assertTags(['test', 'bla']);
  });

  test('tags can be removed', async () => {
    const view = renderTags();

    const testTag = screen.getByRole('button', { name: /test/i });
    await userEvent.click(testTag);

    view.rerender();
    await assertTags(['bla']);
    expect(view.data()).toHaveLength(1);
  });

  test('tags can be added', async () => {
    const view = renderTags();

    const addTagBtn = screen.getByRole('button', { name: /Add new tag/i });
    await userEvent.click(addTagBtn);
    const inputField = screen.getByRole('combobox');
    await userEvent.type(inputField, 'newtag{enter}');

    view.rerender();
    await assertTags(['test', 'bla', 'newtag']);
    expect(view.data()).toHaveLength(3);
    expect(view.data()[2]).toEqual('newtag');
  });

  test('tags with space can not be added', async () => {
    const view = renderTags();

    const addTagBtn = screen.getByRole('button', { name: /Add new tag/i });
    await userEvent.click(addTagBtn);
    const inputField = screen.getByRole('combobox');
    await userEvent.type(inputField, 'new tag{enter}');

    view.rerender();
    expect(view.data()[2]).toEqual('newtag');
  });

  test('tags can be handled with keyboard', async () => {
    const view = renderTags();

    await userEvent.tab();
    expect(screen.getByRole('button', { name: /test/i })).toHaveFocus();
    await userEvent.keyboard('[Enter]');

    await userEvent.tab();
    expect(screen.getByRole('button', { name: /bla/i })).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByRole('button', { name: /Add/i })).toHaveFocus();
    await userEvent.tab();

    expect(screen.getByRole('combobox')).toHaveFocus();
    await userEvent.tab();

    view.rerender();
    await assertTags(['bla']);
    expect(view.data()).toHaveLength(1);

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole('combobox')).toHaveFocus();
    await userEvent.keyboard('newtag');
    await userEvent.keyboard('[Enter]');

    view.rerender();
    await assertTags(['bla', 'newtag']);
    expect(view.data()).toHaveLength(2);
  });

  test('tags can be added via dropdown', async () => {
    const view = renderTags();

    const addTagBtn = screen.getByRole('button', { name: /Add new tag/i });
    await userEvent.click(addTagBtn);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(2);
    const deprecatedTag = screen.getByRole('option', { name: 'deprecated' });
    await userEvent.click(deprecatedTag);

    view.rerender();
    await assertTags(['test', 'bla', 'deprecated']);
    expect(view.data()).toHaveLength(3);
    expect(view.data()[2]).toEqual('deprecated');
  });

  test('tags support readonly mode', async () => {
    customRender(
      <Tags tags={['test']} availableTags={['demo', 'deprecated']} customValues={true} onChange={() => {}} allowSpaces={false} />,
      {
        wrapperProps: { editor: { readonly: true } }
      }
    );

    expect(screen.getByRole('button', { name: /test/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Add new tag/i })).toBeDisabled();
  });
});
