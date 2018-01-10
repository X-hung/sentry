import {Box, Flex} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import {t} from '../../../locale';
import AsyncView from '../../asyncView';
import Button from '../../../components/buttons/button';
import Form from '../components/forms/form';
import JsonForm from '../components/forms/jsonForm';
import Panel from '../components/panel';
import PanelBody from '../components/panelBody';
import PanelHeader from '../components/panelHeader';
import Row from '../components/row';
import SettingsPageHeader from '../components/settingsPageHeader';
import accountEmailsFields from '../../../data/forms/accountEmails';

const ENDPOINT = '/account/emails/';

const RemoveButton = styled(({hidden, ...props}) => (
  <Button priority="danger" size="small" {...props}>
    <span className="icon-trash" />
  </Button>
))`
  ${p => (p.hidden ? 'opacity: 0' : '')};
`;

class EmailRow extends React.Component {
  static propTypes = {
    email: PropTypes.string.isRequired,
    isVerified: PropTypes.bool,
    isPrimary: PropTypes.bool,
    onRemove: PropTypes.func,
    hideRemove: PropTypes.bool,
  };

  handleRemove = e => {
    this.props.onRemove(this.props.email, e);
  };

  render() {
    let {email, isPrimary, isVerified, hideRemove} = this.props;

    return (
      <Row>
        <Flex align="center" flex="1">
          <Flex flex="1">
            <div>{email}</div>
          </Flex>
          <Flex ml={2}>
            {isPrimary ? 'Primary' : ''}
            {!isVerified ? 'Unverified' : ''}
          </Flex>
        </Flex>

        {!isPrimary &&
          !hideRemove && (
            <Flex ml={2}>
              <RemoveButton
                onClick={this.handleRemove}
                hidden={isPrimary || hideRemove}
              />
            </Flex>
          )}
      </Row>
    );
  }
}

class AccountEmails extends AsyncView {
  getEndpoints() {
    return [['emails', ENDPOINT]];
  }

  handleSubmitSuccess = (change, model, id) => {
    model.setValue(id, '');
  };

  handleRemove = email => {
    this.api.requestPromise(ENDPOINT, {
      method: 'DELETE',
      data: {
        email,
      },
    });
  };

  renderBody() {
    let {emails} = this.state;
    let primary = emails.find(({isPrimary}) => isPrimary);
    let secondary = emails.filter(({isPrimary}) => !isPrimary);

    return (
      <div>
        <SettingsPageHeader title="Emails" />

        <Panel>
          <PanelHeader>
            <Box>{t('Emails')}</Box>
          </PanelHeader>
          <PanelBody>
            {primary && <EmailRow onRemove={this.handleRemove} {...primary} />}

            {secondary &&
              secondary.map(emailObj => {
                return (
                  <EmailRow
                    key={emailObj.email}
                    onRemove={this.handleRemove}
                    {...emailObj}
                  />
                );
              })}
          </PanelBody>
        </Panel>

        <Form
          apiMethod="POST"
          apiEndpoint={ENDPOINT}
          saveOnBlur
          onSubmitSuccess={this.handleSubmitSuccess}
        >
          <JsonForm location={this.props.location} forms={accountEmailsFields} />
        </Form>
      </div>
    );
  }
}

export default AccountEmails;
