import React from 'react';

import Button from '../component/atoms/Button';
import {PanelTitle} from '../component/atoms/Panel';
import Popup from '../component/atoms/Popup';
import {Checkbox} from '../component/atoms/input/Input';
const ConfirmationDialogContext = React.createContext<{
  openDialog: (config: DialogConfig & DialogCallback) => void;
  resetDialog: () => void;
}>({openDialog: () => {}, resetDialog: () => {}});

interface DialogConfig {
  title: string;
  message: string;
  confirmButton?: string;
  cancelButton?: string;
  blockInterface?: boolean;
  checkBox?: string;
  onCheck?: (checked: boolean) => void;
}

interface DialogCallback {
  actionCallback?: (accepted: boolean) => void;
}

export const ConfirmationDialogProvider = ({children}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogConfig, setDialogConfig] = React.useState<(DialogConfig & DialogCallback) | null>(
    null
  );

  const openDialog = (options: DialogConfig & DialogCallback) => {
    setDialogOpen(true);
    setDialogConfig(options);
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setDialogConfig(null);
  };

  const onConfirm = () => {
    resetDialog();
    if (dialogConfig?.actionCallback) dialogConfig.actionCallback(true);
  };

  const onDismiss = () => {
    resetDialog();
    if (dialogConfig?.actionCallback) dialogConfig.actionCallback(false);
  };

  return (
    <ConfirmationDialogContext.Provider value={{openDialog, resetDialog}}>
      <div className="z-pop-over">
        {dialogOpen && (
          <div className="absolute inset-0 bg-dark-blue-50">
            <Popup>
              <PanelTitle>{dialogConfig?.title}</PanelTitle>
              <p>{dialogConfig?.message}</p>
              <div className="flex pt-2 gap-1">
                {dialogConfig?.confirmButton && (
                  <Button type="primary" onClick={onConfirm}>
                    {dialogConfig?.confirmButton || ''}
                  </Button>
                )}
                {dialogConfig?.cancelButton && (
                  <Button type="ghost" onClick={onDismiss}>
                    {dialogConfig?.cancelButton || ''}
                  </Button>
                )}
                {dialogConfig?.checkBox && (
                  <Checkbox
                    label={dialogConfig.checkBox}
                    onChange={(e) => dialogConfig?.onCheck?.(e.target.checked)}
                  />
                )}
              </div>
            </Popup>
          </div>
        )}
      </div>
      {children}
    </ConfirmationDialogContext.Provider>
  );
};

export const useConfirmationDialog = () => {
  const {openDialog, resetDialog} = React.useContext(ConfirmationDialogContext);

  const getConfirmation = ({...options}: DialogConfig) =>
    new Promise<boolean>((res) => {
      openDialog({actionCallback: res, ...options});
    });

  return {getConfirmation, resetDialog};
};
