export const enGb = {
  translation: {
    time: {
      days: '{{days}} days',
      hours: '{{hours}} hours',
      minutes: '{{minutes}} minutes',
      seconds: '{{seconds}} seconds'
    },
    somethingWentWrong: 'Something went wrong. Please try again later.',
    staking: {
      rewardAccountError:
        'The selected destination account does not exist and cannot be used to receive rewards',
      customRewardDestination: 'Account Address',
      stopStaking: 'Stop Staking',
      withdrawUnbonded: 'Withdraw',
      unbondFunds: 'Unbond Funds',
      nominator: 'Nominator',
      validatorsTab: 'Validators',
      account: 'Account',
      authorization: 'Authorization',
      stakingTab: {
        stakingDashboard: 'Stake KSM - Setup Nominator',
        validators: 'Stake KSM - Select Validators',
        authorization: 'Stake KSM - Authorization',
        favouriteTooltip: 'Create your list of favorite nodes for quick staking',
        selectTooltip: 'Create your diverse set of validators from below list',
        sortingInfo: {
          label: 'How we sort',
          header: 'Below list is sorted according to:',
          points: {
            1: '1) Favorite operators on top',
            2: '2) Operators in Kusamaverse',
            3: '3) Least commission',
            4: '4) Most own stake',
            5: '5) Least amount of nodes',
            6: '6) With identity',
            7: '7) The rest of nodes'
          }
        }
      },
      accountPair: 'Stash & Controller Pair',
      unbondingInfoAccounts:
        'The stash and controller pair, here the controller will be used to send the transaction.',
      unbondingPeriod:
        'The funds will only be available for withdrawal after the unbonding period, however will not be part of the staked amount after the next validator election. You can follow the unlock countdown in the UI.',
      fee: 'fee',
      bondCall: 'bond()',
      unbondCall: 'unbond()',
      withdrawUnbondedCall: 'withdrawUnbonded()',
      chillCall: 'chill()',
      chillInfo: 'Declare no desire to either validate or nominate',
      nominateCall: 'nominate()',
      setController: 'setController()',
      transactionCalls: 'Transaction Calls To Execute',
      sendingFrom: 'Sending From Account',
      walletAccount: 'Wallet Account',
      stashBalance: 'Stash Balance',
      activeStake: 'Active Stake',
      scanAccount: 'Scan Account Links',
      selectedNominees: 'Selected Nominees',
      nominate: 'nominate',
      balanceTypes: {
        account: 'Account Balance',
        transferable: 'Transferable',
        staked: 'Staked',
        unbonding: 'Unbonding',
        redeemable: 'Redeemable'
      },
      unbond: 'Unbond',
      stakingBlocks: '{{blocks}} blocks',
      erasRemaining: '{{eras}} eras remaining',
      noActiveStakes: "This Account Doesn't Have Any Active Stakes At The Moment",
      changeNominator: 'change nominator',
      stakingWalletAccountHeading: 'Staking Wallet Account',
      pickAccount: 'Pick a wallet account',
      pickDestination: 'Pick a reward destination',
      stashLabel: 'stash',
      rewardDestination: 'reward destination',
      specificDestination: 'Specific Destination',
      unbondAmount: 'Unbond Amount',
      setAmount: 'Set Amount',
      nominateAndBond: 'Nominate & Bond',
      signAndSubmit: 'Sign & Submit',
      stashController: 'Controller',
      selectAmount: 'Select amount to stake',
      available: 'Available',
      feeInfo: 'Fees of {{fee}} will be applied for submission',
      stashIncreaseAmount: 'Stash Account (re-stake reward)',
      stashNoIncreaseAmount: 'Stash Account (do not re-stake reward)',
      controllerAccount: 'Controller Account',
      specifiedPaymentAccount: 'Specified Payment Account',
      stashAccount: 'Stash Account',
      signedSuccess: 'Transaction finished. Writing to block was successful!',
      validation: {
        unbondMinAmount: 'Minimum amount for unbonding should be a positive number',
        unbondMaxAmount:
          'Maximum amount for unbonding should not be over the bonded amount of {{bonded}}',
        controller: {
          stashed:
            'A controller account should not map to another stash. This selected controller is a stash, controlled by {{bondedAddress}}',
          multipleStashes:
            'A controller account should not be set to manage multiple stashes. The selected controller is already controlling {{usedStashAddress}}',
          sufficientFunds:
            'The controller does not have sufficient funds available to cover transaction fees. Ensure that a funded controller is used.',
          distinctAccounts:
            'Distinct stash and controller accounts are recommended to ensure fund security. You will be allowed to make the transaction, but take care to not tie up all funds, only use a portion of the available funds during this period.',
          minAmount: 'The bonded amount is less than the minimum bond amount of {{minAmount}}',
          destinationNotExisting:
            'The selected destination account does not exist and cannot be used to receive rewards'
        },
        stakeAmount: {
          notEnough:
            'The specified value is large and may not allow enough funds to pay future transaction fees.',
          minExistentialDeposit:
            'The bonded amount is less than the minimum bond amount of {{existentialDeposit}}',
          minNominatorBond:
            'The bonded amount is less than the minimum threshold of {{minNominatorBond}} for nominators',
          minNominatedAmount:
            'The bonded amount is less than the current active minimum nominated amount of {{minNomination}} and depending on the network state, may not be selected to participate',
          minThresholdValidators:
            'The bonded amount is less than the minimum threshold of {{minBond}} for validators'
        }
      },
      validators: {
        searchInputPlaceholder: 'Search for...',
        withIdentity: 'With identity',
        legendBookmark: 'Favorite',
        legendSelect: 'Select for Staking',
        legendInfo: 'Info',
        legendFlyTo: 'Fly to',
        columnHeaderOperator: 'Operator',
        columnHeaderValidator: 'Validator',
        columnHeaderCommission: 'Commission',
        columnHeaderOwnStake: 'Own Stake'
      }
    },
    wrongBrowser: {
      title: "You're using an unsupported browser",
      message: 'Browsers that are currently supported',
      browserList: 'Google Chrome, Mozilla Firefox'
    },
    login: {
      welcome: 'Welcome to',
      enableStaking: 'Login with a polkadot.js account to enable on chain activities'
    },
    errors: {
      oidcSession: 'Something wrong with session',
      sessionExpired: 'The login session has expired. Please try again.',
      unknownError: 'Could not login please try again.',
      noAccounts:
        'No account detected in the Polkadot.js extension, please create an account to continue here.',
      unsupportedNetwork: "You're connected to an unsupported network.",
      ethereumAccess: 'Please authorize this website to access your Ethereum account.',
      ethereumExtension:
        'No {{name}} extension detected, please install {{name}} to continue here.',
      couldNotRemoveEvent: 'Could not remove the event.',
      endDateGraterThanStartDate: 'End date has to be grater than start date',
      nameConstraints: 'Please enter a name with 2-32 characters'
    },
    counts: {
      people_one: '{{count}} Person',
      people_other: '{{count}} People',
      attendees_one: `{{count}} Attendee`,
      attendees_other: `{{count}} Attendees`,
      vibes_one: '{{count}}  vibe',
      vibes_other: '{{count}}  vibes'
    },
    labels: {
      miro: 'Miro',
      googleDrive: 'Google Drive',
      screenShare: 'Screenshare',
      stageMode: 'Stage Mode',
      calendar: 'World Calendar',
      staking: 'Staking',
      minimap: 'Minimap',
      musicPlayer: 'Music Player',
      shareLocation: 'Share location',
      information: 'Information',
      help: 'Help',
      settings: 'Settings',
      fullscreen: 'Fullscreen',
      someonesBio: "{{name}}'s Bio",
      myBio: 'My Bio',
      logout: 'Logout',
      worldStats: 'World stats',
      tokenRules: 'Token Rules',
      nameOfInitiative: 'Name of Initiative',
      initiatives: 'Initiatives',
      description: 'Description',
      people: 'People',
      explore: 'Explore',
      person: 'Person',
      online: 'Available',
      dnd: 'Do Not Disturb',
      subspaces: 'Subspaces',
      searchResults: 'Search Results',
      attendeeList: 'Attendee List',
      speakers: 'Speakers',
      audience: 'Audience',
      you: 'You',
      cameraOn: 'Camera on',
      cameraOff: 'Camera off',
      microphoneOn: 'Microphone on',
      microphoneOff: 'Microphone off',
      webcamPreview: 'Webcam Preview',
      audioVideoSettings: 'Audio/Video Settings'
    },
    messages: {
      loading: 'Loading Odyssey Momentum',
      onlineArena: 'Online Mass Collaboration Arena',
      loading30sec: 'If Momentum does not load within 30 seconds, please',
      clearCache: 'Clear your cache',
      version: 'Version {{version}}',
      welcome: "Login successful. We invite you to Momentum's intro. Hit play below!",
      loginSuccessful: 'Login Successful',
      playFriggin: 'Play the Friggin’ Intro',
      signIn: 'Sign In Or Create An Account',
      linkCopied: 'The link is copied to your clipboard.',
      fullyEnjoy: 'Connect your wallet to fully enjoy Momentum!',
      flyAround: 'Fly around and start experiencing Momentum!',
      extensionOpen:
        'The {{name}} extension will now open and ask you to authenticate and sign a message.',
      extensionWindow:
        'If this window is not opened then click on the extension in the browser to authenticate and sign.',
      magicLink:
        'Here is the magic link that you can copy and send to anyone you want to invite to this location.',
      tokenRuleSuccess: 'Token rule was {{action}} successfully',
      tokenRuleFailure: 'An error did occur while {{action}} token rule',
      requestFailure: 'An error has occurred while {{action}}.',
      pleaseConfirm: 'Please confirm',
      delete: 'Are you sure you want to delete this?',
      removeEventSuccess: 'Removed event successfully.',
      avatarSuccess: 'Avatar saved successfully',
      avatarFailure: 'There was a problem saving the avatar',
      spaceEditSuccess: 'Successfully edited space',
      spaceSaveFailure: 'There was an error saving the space',
      spaceDeleteFailure: 'There was an error deleting the space',
      joinSpaceWelcome: 'Click on the button to join the space!',
      spaceInvitationNote: '{{invitor}} has invited you to {{spaceName}}',
      highFiveSentTitle: 'High five sent to {{name}}',
      highFiveSentText: 'You sent a high five',
      highFiveReceivedTitle: '{{name}} has sent you a high five',
      highFiveReceivedText: 'Click on the button to high five back!',
      launchInitiativeNote: 'Feel free to launch your initiative at a later time.',
      launchSpaceNote: 'Launch your initiative in just one minute',
      maximumParticipants:
        "The maximum number of video participants have been reached. New participants won't be able to stream their webcam.",
      memberAddSuccess: 'The member was successfully added',
      invitationSendSuccess: 'The invitation was sent successfully',
      memberRoleEditSuccess: 'The member role was successfully edited',
      memberRemoveSuccess: 'The member was removed successfully',
      memberRemoveFailure: 'There was an error removing the member',
      userRequestDeny: 'Cannot Accept User Request',
      offStageFailure: 'Cannot send {{user}} off stage',
      joinStageRequestFailure: 'Request has not been made at the moment, try again later',
      joinStageRefused: 'Could not join stage.',
      inviteToStageFailure: 'Cannot invite {{user}} to stage',
      subSpaceDeleteFailure: 'There was an error deleting the subspace',
      subSpaceCreateFailure: 'There was an error creating the subspace',
      stageModeActivated:
        'The stage has been enabled right now. Want to participate? Ask to go on stage.',
      stageModeNotActiveGuest: `Stage Mode has not Been Toggled\n\nA space member must toggle this`,
      stageModeNotActiveModerator: `Stage Mode has not Been Toggled\n\nYou can toggle stage-mode, since you are a member of this space`,
      stageModeDeActivated: 'The stage has been disabled',
      stageModeFull: 'The stage is currently full. Try again later to go on stage.',
      stageModeMuted: 'You have been muted by a member of the space.',
      kickedFromMeeting: 'A Space Admin has kicked you from the space',
      joinGathering: 'The gathering {{title}} is about to start',
      updateSpace:
        'Please update your space with a meme and a poster within 1 week (otherwise your space will be archived).',
      noTeamMiroBoard: 'Your team does not have a Miro board yet',
      noMiroBoard: 'This team does not have a Miro board yet',
      noTeamDocument: 'Your team does not have a Google Drive Document open yet',
      noDocument: 'This team does not have a Google Drive Document open yet',
      noScreenSharing: 'There is no one screensharing',
      preparingScreenSharing: 'preparing screen share',
      tileCreateSuccess: 'Your tile has been created successfully',
      tileCreateError: 'There was a problem creating your tile',
      tileUpdateSuccess: 'Your tile has been updated successfully',
      tileUpdateError: 'There was a problem updating your tile',
      tileRemoveSuccess: 'Your tile has been successfully removed',
      tileRemoveError: 'There was a problem removing your tile',
      pendingRequestToGoOnStage: 'Request to go on stage pending',
      stageIsFull: 'Stage is full',
      stageIsActive: 'Stage is active',
      stageIsInactiveToggleToActivate: 'Stage is inactive. Toggle to activate.',
      noParticipantsOnStage: 'There are currently no participants on stage.',
      onStage: 'On Stage',
      requestedPermissionToGoOnStage: 'You have requested permission to go on stage',
      waitForModeratorsToAccept: 'Wait for the moderators to accept or deny your request',
      thisPersonWantsToComeOnStage: 'This person wants to come on stage, invite them?',
      thisWillEnablePersonToUseStage:
        '(This will enable the person to talk, screenshare, and transmit video)',
      stageIsCurrentlyFull:
        '(The stage is currently full, you must first remove someone from the stage before you can accept)',
      youAreInAudience: 'You are in the audience, stage mode is on',
      newDeviceDetected:
        'Momentum has detected a new {{deviceKind}} device named "{{deviceName}}". Do you want to switch to it?',
      inviteSuccess: 'You have successfully invited {{user}} to the space',
      inviteError: 'There was a problem inviting {{user}} to space',
      areYouSureYouWantToRemoveUserFromStage: `Are you sure you want remove {{name}} from stage?`,
      wouldYouLikeToGoOnStage: 'Would you like to go on stage?',
      thisWillEnableYouToUseStage:
        '(This will enable you to talk, screenshare, and transmit video)',
      pleaseTryAgainLater: 'Please try again later'
    },
    titles: {
      alert: 'alert',
      joinSpace: 'join the space',
      returnHighFive: 'Return the favour',
      createSpace: 'YOU CAN CREATE A SPACE FROM YOUR PROFILE',
      ownSpaceInvite: 'WANT YOUR OWN SPACE? (FREE)',
      later: 'later',
      create: 'create',
      stage: 'Stage mode',
      kickedFromMeeting: 'You have been kicked from a space',
      joinGathering: 'Gathering Event is starting now',
      updateSpace: 'update your space with some enticing content',
      goToStageMode: 'Click to go to stage-mode',
      userWantsToComeOnStage: '{{user}} wants to come on stage',
      newDeviceDetected: 'New Device Detected',
      inviteUsers: 'Invite users',
      removeParticipantFromStage: 'Remove Participant From Stage',
      yourRequestHasBeenAccepted: 'Your request has been accepted,',
      getReadyToGetLive: 'Get ready. You are about to go live in.',
      goingOnStage: 'Going On Stage',
      yourRequestWasDeclined: 'Your request was declined',
      youHaveBeenInvitedOnStage: 'You have been invited on stage',
      prepareToGoOnStage: 'Prepare to go on stage',
      broadcastManage: 'Manage Broadcast'
    },
    tooltipTitles: {
      openAdmin: 'Open Admin',
      closeChat: 'Close Chat',
      openChat: 'Open Chat',
      favorite: 'Favorite',
      flyAround: 'Fly Around',
      close: 'Close'
    },
    placeholders: {
      search: 'Search',
      searchForPeople: 'Search for people...',
      searchForSpaces: 'Search for spaces...',
      searchForAttendees: 'Search for attendees...'
    },
    fields: {
      nickname: 'Nickname',
      description: 'Description',
      name: 'Name',
      social: 'Social',
      bio: 'Bio',
      location: 'Location',
      site: 'Site'
    },
    networks: {
      polkadot: 'Polkadot.js',
      metamask: 'Metamask',
      walletconnect: 'Wallet connect',
      guest: 'Guest'
    },
    actions: {
      ok: 'OK',
      approve: 'Approve',
      joinStage: 'Join Stage',
      decline: 'Decline',
      cancel: 'Cancel',
      emailLogin: 'Email Login',
      goBack: 'Go back',
      back: 'Back',
      chooseAvatar: 'Choose an image for your avatar',
      saveProfile: 'Save profile',
      selectAccount: 'Select account',
      selectPolkadotAccount: 'Select your Kusama address to login',
      copyLink: 'Copy Link',
      createInitiative: 'Launch new initiative',
      flyTo: 'Fly to',
      flyToThisSpace: 'Fly to this space',
      grabTable: 'Grab table',
      highFive: 'High five',
      saveChanges: 'Save changes',
      approving: 'approving',
      approved: 'approved',
      delete: 'delete',
      declined: 'declined',
      declining: 'declining',
      removed: 'removed',
      removing: 'removing',
      joined: 'joined',
      refresh: 'Refresh',
      launch: 'Launch',
      confirmRemove: 'yes, remove',
      removeRule: 'remove rule',
      noCancel: 'no, cancel',
      save: 'save',
      launchInitiativeSuccess: 'Launched initiative succesfully, you will be now teleported.',
      lunchingInitiative: 'launching initiative',
      invite: 'Invite',
      invited: 'Invited',
      closeAndContinue: 'Close and Continue',
      return: 'Return',
      leave: 'Leave',
      muteName: 'Mute {{name}}',
      kickName: 'Kick {{name}}',
      changeBoard: 'Change board',
      chooseBoard: 'Choose a Miro board',
      chooseDocument: 'Choose a document',
      changeDocument: 'Change document',
      leaveStage: 'Leave stage',
      goOnStage: 'Go on stage',
      remove: 'Remove',
      mute: 'Mute',
      unmute: 'Unmute',
      startScreenShare: 'Start screensharing',
      accept: 'Accept',
      switchDevice: 'Switch device',
      getReady: 'Get Ready',
      close: 'Close',
      inviteToStage: 'Invite to stage',
      ready: 'Ready',
      inviteThisPersonToTheStage: 'Invite this person to the stage?'
    },
    fileUploader: {
      uploadLabel: 'Upload Image',
      changeLabel: 'Change Image',
      dragActiveLabel: 'Drop the files here...'
    },
    eventList: {
      noGatherings: 'There are no gatherings scheduled for this space.',
      eventItem: {
        live: 'Live',
        websiteLink: 'Learn More',
        magicLinkDialog: {
          title: 'Magic Link',
          copyLabel: 'Copy Link'
        },
        websiteLinkDialog: {
          title: 'Website Link',
          copyLabel: 'Copy Link'
        },
        flyToSpace: 'Fly To',
        gatheringLink: 'Share',
        addToCalendar: 'Add to My Calendar',
        joinGathering: 'Join The Gathering',
        by: 'By',
        at: 'At',
        from: 'From',
        to: 'To',
        showMore: 'Show more',
        collapse: 'Show less',
        attendees_one: `{{count}} Attendee`,
        attendees_other: `{{count}} Attendees`,
        interested: 'Interested'
      }
    },
    eventForm: {
      addTitle: 'Create Gathering',
      editTitle: 'Edit Gathering',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Describe your gathering here',
      linkLabel: 'Optional URL',
      linkPlaceholder: 'Add a Website Link to Your Gathering',
      hostLabel: 'host',
      hostPlaceholder: 'Add a Host to Your Gathering',
      titleLabel: 'title',
      titlePlaceholder: 'Add a Title to Your Gathering',
      startDateTimeLabel: 'Start Date and Time',
      startDateTimePlaceholder: 'Set Start Date and Time',
      endDateTimeLabel: 'End Date and Time',
      endDateTimePlaceholder: 'Set End Date and Time',
      errorMessage: 'This field is required'
    },
    tokenRules: {
      tokenForm: {
        title: 'add a new token',
        submitButtonLabel: 'add token',
        description: 'Add a new token',
        tokenTypeLabel: 'Select token type',
        tokenTypePlaceholder: 'Token Type',
        tokenIDLabel: 'token id',
        tokenIDPlaceholder: 'Token ID',
        networkLabel: 'select network',
        networkPlaceholder: 'Network',
        contractAddressLabel: 'smart contract address',
        contractAddressPlaceholder: 'Address',
        tokenSelectedDescription: 'Automatically selected from Smart Contract',
        tokenNotFilledDescription:
          'After selecting network and a valid smart contract address the token will be shown here',
        tokenCreatedSuccessMessage: 'Your Token can now be selected when defining a new token rule'
      },
      tokenRuleForm: {
        title: 'Define a new token rule',
        submitButtonLabel: 'submit rule for approval',
        description: 'Define a new token rule for the list',
        tokenRuleNameLabel: 'new token rule name',
        tokenRuleNamePlaceholder: 'Add a Name Here',
        searchInputLabel: 'token select',
        searchInputPlaceholder: 'Select or Add New Token',
        minimumBalanceLabel: 'minimum balance',
        minimumBalancePlaceholder: 'Add a Minimum Balance To This Rule',
        addLabelButton: 'Add New Token',
        tokenRuleCreatedSuccessMessage: 'Your Token Rule has been added to your space'
      },
      tokenRuleReview: {
        dialogTitle: 'Token Rule Name',
        dialogDescription: 'Review a token gated access rule request for your world.',
        tokenLabel: 'token',
        networkLabel: 'network',
        addressLabel: 'address',
        minimumAmountLabel: 'minimum amount',
        spaceRequestedLabel: 'space requested',
        userRequestedLabel: 'user requested',
        tokenIdLabel: 'Token Id'
      },
      applyTokenRuleForm: {
        title: 'Apply a new token rule',
        submitButtonLabel: 'Add Rule',
        succeedButtonLabel: 'Okay',
        description: 'Add a token gated access rule to your space.',
        tokenRuleAppliedSuccessMessage: 'The Token Rule has been applied to your space',
        searchInputLabel: 'Token rule',
        searchInputPlaceholder: 'Search for token rule or add new one',
        addLabelButton: 'Add New Token Rule',
        selectedTokenTypeLabel: 'Token',
        selectedTokenNetworkLabel: 'network',
        selectedTokenAddressLabel: 'address',
        selectedTokenMinBalanceLabel: 'Minimum Amount',
        dropdown: {
          placeholder: 'Select a role'
        }
      },
      removeTokenRuleDialog: {
        title: 'remove Token Rule from space',
        message: 'Are you sure you want to remove the {{name}} from this space?'
      },
      editTokenRuleDialog: {
        success: 'The token rule role was successfully edited',
        title: 'Change member',
        dropdownPlaceholder: 'Select a role'
      },
      memberLabel: 'member',
      adminLabel: 'admin',
      deleteApproveMessage: 'no, cancel',
      approve: 'approve',
      declined: 'declined',
      requested: 'requested',
      status: 'status',
      ruleName: 'Rule Name',
      noTokenRules: 'No token rules',
      overview: {
        title: 'token rules Overview'
      }
    },
    broadcastAdmin: {
      subtitle: 'Manage Broadcast'
    },
    spaceAdmin: {
      subtitle: 'Manage Space',
      noAccess: 'You have no admin rights for that space',
      sectionPanel: {
        tokenRulesPanel: 'Token rules',
        spaceMemberPanel: 'Space Members',
        subSpacesPanel: 'Subspaces'
      },
      spaceDetails: {
        title: 'Space details',
        typeLabel: 'Type',
        accessLabel: 'Access',
        accessWarning: 'Turning on private only allows members and admins of the space to enter',
        privateSpaceText: 'Private space',
        spaceNameLabel: 'Space Name',
        deleteSpaceLabel: 'Delete Space',
        saveDetailsLabel: 'Save Details',
        spaceNameError: 'Space name is required',
        deleteConfirmation: {
          title: 'Delete space',
          text: 'Are you sure you want to delete this space?',
          acceptLabel: 'Yes, delete',
          declineLabel: 'No, cancel'
        }
      },
      users: {
        title: 'Space Members',
        removeConfirmation: {
          title: 'Remove member from space',
          text: 'Are you sure you want to remove the {{name}} from this space?',
          acceptLabel: 'Yes, remove',
          declineLabel: 'No, cancel',
          success: 'The member was removed successfully',
          failure: 'There was an error removing the member'
        },
        addMemberDialog: {
          title: 'Invite new member',
          message: 'You are about to invite a new member to the space.',
          query: {
            label: 'Query',
            placeholder: 'Search for name or email',
            errors: {
              required: 'Please enter a query',
              nonSelected: 'Please select a user from the dropdown list'
            },
            dropdownPlaceholder: 'Select a user'
          },
          dropdown: {
            label: 'member role',
            member: 'Member',
            admin: 'Admin',
            placeholder: 'Select a role',
            errors: {
              required: 'Please select a role'
            }
          },
          approveLabel: 'Add member',
          declineLabel: 'Cancel',
          successInvite: 'Invitation sent!',
          successAdd: 'User added to the space sucessfully',
          failure: 'There was an error inviting the member'
        },
        editMemberDialog: {
          title: 'Change member',
          approveLabel: 'save',
          declineLabel: 'cancel',
          dropdown: {
            placeholder: 'member role',
            member: 'Member',
            admin: 'Admin'
          },
          success: 'The member role was successfully edited'
        }
      },
      subSpaces: {
        title: 'SubSpaces',
        addSubSpaceDialog: {
          title: 'Create new subspace',
          message: 'You are about to create a new subspace for the space "{{spaceName}}".',
          approveLabel: 'save',
          declineLabel: 'cancel',
          dropdown: {
            label: 'Space Type',
            placeholder: 'Select a type',
            errors: {
              required: 'Please select a type'
            }
          },
          name: {
            label: 'Name',
            placeholder: 'Type name of space',
            errors: {
              required: 'Please enter a name'
            }
          }
        }
      }
    },
    helpSection: {
      title: 'help',
      helpNote:
        'You are about to embark on your flight in Momentum.\n\n Below we have a good dose of the essentials for you to get started.\n\n We have long term plans with Momentum, yet we are at humble beginnings with the release of this first milestone. We are so delighted you are flying with us!\n\n We invite you to help us improve Momentum, as we are at humble beginnings with the release of this first milestone. So...\n\n Something doesn’t work for you? Let us know!\n Something you are missing? Let us know!\n Something you feel should be different? Let us know!\n\nWant to help building Momentum? Let us know ;)',
      discord: {
        iconLabel: 'discord',
        dropDownLabel: 'Join discord',
        topTextOne: 'Got any feedback, question, or just wanna chat with us? Visit our',
        topTextBold: ' Discord!',
        bottomTextOne: 'Need flight assistance? Get in touch with our',
        bottomTextTwo: 'team!',
        bottomTextBold: ' @Tech-Support! ',
        serverButtonLabel: 'visit discord server',
        supportButtonLabel: 'tech support channel'
      },
      controls: {
        iconLabel: 'controls',
        dropDownLabel: 'Controls',
        buttonsText: 'To fly, use the following controls: ',
        wLetter: 'W',
        aLetter: 'A',
        sLetter: 'S',
        qLetter: 'Q',
        eLetter: 'E',
        dLetter: 'D',
        forwardLabel: ' - FORWARD',
        leftLabel: ' - LEFT',
        backwardLabel: ' - BACKWARD',
        rightLabel: ' - RIGHT',
        downWardLabel: ' - DOWNWARD',
        upWardLabel: ' - UPWARD',
        buttonsIconLabel: 'qweasd',
        arrowsTextFirst: 'You can also use the ',
        arrowsTextSecond: ' for forward,\r\n backward, left and right movement.',
        arrowsBoldText: 'Arrow Keys',
        arrowsIconLabel: 'arrow-keys',
        shiftTextFirst: 'Hold ',
        shiftTextBold: 'Shift',
        shiftTextSecond: ' while flying: Fast flight mode',
        shiftIconLabel: 'shift-button',
        mouseBoldTextFirst: 'Mouse',
        trackPadBoldText: ' Trackpad',
        mouseBoldTextSecond: 'left mouse button',
        mousePadTextFirst: ' or',
        mousePadTextSecond: ': Turn camera',
        mousePadTextThird: ': Interact with objects',
        mousePadIconLabel: 'mouse-pad',
        spaceBarTextFirst: 'Hold',
        spaceBarBoldText: ' space',
        spaceBarTextSecond: ' while not moving: Look around',
        spaceBarIconLabel: 'space-bar'
      },
      momentum: {
        title: 'Momentum Space',
        paragraphs: {
          one: "You're diggin' it and you want to be more involved?",
          two: {
            partOne: 'Join us at our ',
            highlightedPart: 'Weekly KSMverse Community Calls',
            partTwo:
              ', on Wednesdays and Fridays 3pm CEST, in the Kusamaverse, where we will talk about all things Dotsmama, metaversal and phygital!'
          },
          three: {
            partOne: 'Check out ',
            highlightedPart: 'the Calendar on our Momentum space',
            partTwo:
              ' or updates on topics. Want to be a guest speaker and share your insights with the community? Do reach out to us on Discord.'
          },
          four: 'Wanna chat, or have any more questions, crazy ideas or suggestions to us? Check out our momentum space. LFG!'
        },
        visitSpace: 'Visit the Momentum Space'
      },
      wiki: {
        title: 'Wiki',
        partOne: `Please feel free to deep-dive into the Kusamaverse, its nooks and crannies and feature map in `,
        highlightedPart: 'our Wiki',
        partTwo:
          '. While we do our best to keep our wiki updated please bare in mind this is a living breathing ecosystem that is subject to constant change.',
        link: 'Wiki Link'
      },
      openLabel: 'Expand',
      closeLabel: 'Minimize'
    },
    editProfileWidget: {
      title: 'Edit my bio',
      avatarInstructions: 'Choose an avatar that will be shown when your camera is disabled',
      saveSuccess: 'Saved profile',
      saveFailure: 'Could not save Profile.'
    },
    launchInitiativeWidget: {
      title: 'LAUNCH YOUR INITIATIVE (FREE)',
      description:
        'Fantastic! You are about to launch your initiative. A free space will be created for you that you can use to organise your efforts and to collaborate with others.',
      requiredFieldError: '{{field}} is required',
      minimumCharactersError: 'Minimum {{length}} characters required'
    },
    devices: {
      device: 'device',
      camera: 'camera',
      microphone: 'microphone',
      video: 'video',
      audio: 'audio'
    },
    musicPlayer: {
      playerVolume: 'Music Volume',
      unityVolume: 'Sound Effects Volume',
      noTrackTitle: 'No Track'
    },
    collaboration: {
      spaceIsPrivate: 'This space is set to private by its admin and only accessible by its members'
    },
    dashboard: {
      subtitle: 'dashboard',
      vibe: 'vibe',
      vibes: 'vibes',
      addTile: 'add tile',
      invitePeople: 'invite people',
      stake: 'stake',
      tileForm: {
        title: 'create a new tile',
        createTile: 'create tile',
        updateTile: 'update tile',
        tileType: 'Tile type',
        typePlaceholder: 'Select a type',
        textType: 'Text',
        imageType: 'Image',
        videoType: 'Video',
        videoLabel: 'Youtube video url',
        textLabel: 'Title',
        textPlaceholder: 'Please choose a title',
        descriptionLabel: 'Description',
        descriptionPlaceholder: 'Please write a description'
      },
      removeTileForm: {
        title: 'remove Tile from dashboard',
        message: 'Are you sure you want to remove this tile?'
      }
    }
  }
};
