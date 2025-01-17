import { Button } from '../../../atoms/Button';
import { useDisclosure } from '../../../hooks';

import { ChangePasswordModal } from './change-password-modal';
import {
  SettingsSection,
  SettingsSectionCard,
  SettingsSectionTitle,
} from './settings-section';

export const SettingsTab = () => {
  const {
    open: openChangePasswordModal,
    isOpen: isChangePasswordModalOpen,
    close: onClose,
  } = useDisclosure();

  return (
    <div className="h-full space-y-8 md:rounded-r-3xl md:bg-white md:px-6 md:py-8">
      <SettingsSection>
        <SettingsSectionTitle>Profile</SettingsSectionTitle>
        <SettingsSectionCard>
          <div className="w-full text-center text-sm">Coming soon...</div>
        </SettingsSectionCard>
      </SettingsSection>
      <SettingsSection>
        <SettingsSectionTitle>Security</SettingsSectionTitle>
        <SettingsSectionCard>
          <div className="flex items-center justify-between">
            <div className="text-blue-700">Password</div>
            <Button
              variant="tertiary"
              size="s"
              rounded
              onClick={openChangePasswordModal}
            >
              Change
            </Button>
          </div>
        </SettingsSectionCard>
      </SettingsSection>

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={onClose}
      />
    </div>
  );
};
