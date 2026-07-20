import { BasicInscriptionTabs, Flex, type StateDotProps } from '@axonivy/ui-components';
import { useInscriptionTabState, type PartProps } from './usePart';

import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../../widgets/error/ErrorFallback';

const Part = ({ parts }: { parts: PartProps[] }) => {
  const { value, updateValue } = useInscriptionTabState(parts);

  const updatePart = (newValue: string) => {
    const activeElement = document.activeElement;
    const isTabNavigationElement =
      activeElement instanceof HTMLElement &&
      (activeElement.getAttribute('role') === 'tab' || activeElement.closest('[role="tablist"]') !== null);
    if (activeElement instanceof HTMLElement && !isTabNavigationElement) {
      activeElement.blur();
    }
    updateValue(newValue);
  };

  return (
    <BasicInscriptionTabs
      tabs={parts.map(p => {
        const content = (
          <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[p]}>
            {p.control && (
              <Flex direction='row' gap={2} justifyContent='flex-end'>
                {p.control}
              </Flex>
            )}
            {p.content}
          </ErrorBoundary>
        );
        const state: StateDotProps = {
          ...p.state,
          messages: p.state.validations.map(v => ({
            message: v.message,
            variant: v.severity === 'ERROR' ? 'error' : v.severity === 'WARNING' ? 'warning' : 'description'
          }))
        };
        return {
          ...p,
          content,
          state
        };
      })}
      value={value}
      onChange={updatePart}
    />
  );
};

export default Part;
