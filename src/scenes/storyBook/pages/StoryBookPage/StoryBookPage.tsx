import React, {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';

import {Button, Text, SvgButton, PanelLayout, Dialog, TextArea, Input, PageTopBar} from 'ui-kit';

import * as styled from './StoryBookPage.styled';

const StoryBookPage: FC = () => {
  const [dialog1Shown, setDialog1Shown] = useState<boolean>(false);
  const [dialog2Shown, setDialog2Shown] = useState<boolean>(false);
  const [dialog3Shown, setDialog3Shown] = useState<boolean>(false);
  const [dialog4Shown, setDialog4Shown] = useState<boolean>(false);
  const [dialog5Shown, setDialog5Shown] = useState<boolean>(false);

  const theme = useTheme();

  return (
    <styled.Div className="main">
      <styled.Section>
        <styled.SectionTitle>Components</styled.SectionTitle>

        <styled.Row>
          <styled.Item style={{width: '100%'}}>
            <PageTopBar
              title="spacename"
              subtitle="calendar"
              theme={theme}
              onClose={() => console.info('Topbar close')}
            />
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <PageTopBar
            title="spacename"
            subtitle="calendar"
            theme={theme}
            onClose={() => console.info('Topbar close')}
          >
            <Button variant="danger" label="154 Wows" theme={theme} />
            <Button variant="primary" label="Add Gathering" theme={theme} />
          </PageTopBar>
        </styled.Row>
        <styled.Row>
          <PageTopBar
            title="spacename"
            subtitle="calendar"
            theme={theme}
            actions={
              <>
                <SvgButton iconName="groupChat" size="medium-large" onClick={() => {}} />
              </>
            }
            onClose={() => console.info('Topbar close')}
          >
            <Button variant="danger" label="154 Wows" theme={theme} />
            <Button variant="primary" label="Add Gathering" theme={theme} />
          </PageTopBar>
        </styled.Row>
      </styled.Section>
      <styled.Section>
        <styled.SectionTitle>Base components</styled.SectionTitle>
        <styled.Row>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component with uppercase and border title</styled.ItemName>
              <PanelLayout
                theme={theme}
                title="Your Request has been Accepted"
                headerStyle="divider-uppercase"
              >
                <Text text="Would you like to go on stage?" size="s" align="left" />
                <Text
                  text=" (This will enable the you to talk, screenshare, and transmit video)"
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component with uppercase title</styled.ItemName>
              <PanelLayout theme={theme} title="Some title" headerStyle="uppercase">
                <Text
                  text="Wait for the moderators to accept or deny your reques"
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>
                Component with uppercase and border title and close button
              </styled.ItemName>
              <PanelLayout
                theme={theme}
                title="Some title"
                headerStyle="divider-uppercase"
                onClose={() => console.info('clicked')}
              >
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component with uppercase title and close button</styled.ItemName>
              <PanelLayout
                theme={theme}
                title="Some title"
                headerStyle="uppercase"
                onClose={() => console.info('clicked')}
              >
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component with normal title and close button</styled.ItemName>
              <PanelLayout theme={theme} title="Some title" onClose={() => console.info('clicked')}>
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component with normal title</styled.ItemName>
              <PanelLayout theme={theme} title="Some title">
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component with close button</styled.ItemName>
              <PanelLayout theme={theme} onClose={() => console.info('clicked')}>
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component without anything</styled.ItemName>
              <PanelLayout theme={theme}>
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component with extending content</styled.ItemName>
              <PanelLayout theme={theme} isBodyExtendingToEdges>
                <div style={{background: 'black', width: '100%'}}>Hello</div>
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component without extending content</styled.ItemName>
              <PanelLayout theme={theme}>
                <div style={{background: 'black', width: '100%'}}>Hello</div>
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component with normal title and header icon</styled.ItemName>
              <PanelLayout theme={theme} title="Some title" headerIconName="star">
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>
                Component with normal title and header icon and close button
              </styled.ItemName>
              <PanelLayout
                theme={theme}
                title="Some title"
                headerIconName="star"
                onClose={() => console.info('clicked')}
              >
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>
                Component with uppercase and border title and header icon
              </styled.ItemName>
              <PanelLayout
                theme={theme}
                title="Some title"
                headerIconName="star"
                headerStyle="divider-uppercase"
              >
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
        </styled.Row>
      </styled.Section>
      <styled.Section>
        <styled.SectionTitle>Dialogs</styled.SectionTitle>
        <styled.Row>
          <styled.Item>
            <styled.ItemName>Dialog with approve and accept buttons</styled.ItemName>
            <Button
              variant="primary"
              onClick={() => setDialog1Shown(true)}
              theme={theme}
              label="Click to open"
            />
            {dialog1Shown && (
              <Dialog
                title="Some title"
                approveInfo={{title: 'Approve', onClick: () => setDialog1Shown(false)}}
                declineInfo={{title: 'Decline', onClick: () => setDialog1Shown(false)}}
                closeOnBackgroundClick={false}
              />
            )}
          </styled.Item>
          <styled.Item>
            <styled.ItemName>Dialog with accept button</styled.ItemName>
            <Button
              variant="primary"
              onClick={() => setDialog2Shown(true)}
              theme={theme}
              label="Click to open"
            />
            {dialog2Shown && (
              <Dialog
                title="Some title"
                approveInfo={{title: 'Approve', onClick: () => setDialog2Shown(false)}}
                closeOnBackgroundClick={false}
              />
            )}
          </styled.Item>
          <styled.Item>
            <styled.ItemName>Dialog with decline button</styled.ItemName>
            <Button
              variant="primary"
              onClick={() => setDialog3Shown(true)}
              theme={theme}
              label="Click to open"
            />
            {dialog3Shown && (
              <Dialog
                title="Some title"
                declineInfo={{title: 'Decline', onClick: () => setDialog3Shown(false)}}
                closeOnBackgroundClick={false}
              />
            )}
          </styled.Item>
          <styled.Item>
            <styled.ItemName>Dialog with no buttons and background close</styled.ItemName>
            <Button
              variant="primary"
              onClick={() => setDialog4Shown(true)}
              theme={theme}
              label="Click to open"
            />
            {dialog4Shown && (
              <Dialog title="Some title" onClose={() => setDialog4Shown(false)}>
                <Text theme={theme} text="Click outside of the dialog to close" size="m" />
              </Dialog>
            )}
          </styled.Item>
          <styled.Item>
            <styled.ItemName>Dialog with close button</styled.ItemName>
            <Button
              variant="primary"
              onClick={() => setDialog5Shown(true)}
              theme={theme}
              label="Click to open"
            />
            {dialog5Shown && (
              <Dialog
                title="Some title"
                onClose={() => setDialog5Shown(false)}
                closeOnBackgroundClick={false}
                showCloseButton
              />
            )}
          </styled.Item>
        </styled.Row>
      </styled.Section>
      <styled.Section>
        <styled.Row>
          <styled.Item>
            <PanelLayout>
              <styled.InputPanelLayout>
                <Input label="Token Name" placeholder="Type Here Token Name" isCustom />
                <TextArea name="Label" placeholder="Type Here Token Description" isCustom />
              </styled.InputPanelLayout>
            </PanelLayout>
          </styled.Item>
        </styled.Row>
      </styled.Section>
    </styled.Div>
  );
};

export default observer(StoryBookPage);
