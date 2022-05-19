export const enGb = {
  translation: {
    back: 'back',
    somethingWentWrong: 'Something went wrong. Please try again later.',
    staking: {
      unbondFunds: 'Unbond Funds',
      nominator: 'Nominator',
      validatorsTab: 'Validators',
      account: 'Account',
      stakingTab: {
        stakingDashboard: 'Setup Nominator',
        validators: 'Setup Validators',
        authorization: 'Authorization',
        favouriteTooltip: 'Create your list of favorite nodes for quick staking',
        selectTooltip: 'Create your diverse set of validators from below list',
        sortingInfo: {
          label: 'How we sort',
          header: 'Below list is sorted according to:',
          points: {
            1: '1) Favorited operators on top',
            2: '2) Operators with claimed space in Kusamaverse',
            3: '3) Least commission',
            4: '4) Most own stake',
            5: '5) Least amount of nodes',
            6: '6) With identity',
            7: '7) The rest of nodes'
          }
        }
      },
      fee: 'fee',
      bond: 'bond()',
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
        unbonding: 'Unbonding'
      },
      noActiveStakes: "This Account Doesn't Have Any Active Stakes At The Moment",
      changeNominator: 'change nominator',
      stakingWalletAccountHeading: 'Staking Wallet Account',
      pickAccount: 'Pick a wallet account',
      pickDestination: 'Pick a reward destination',
      stashLabel: 'stash',
      rewardDestination: 'reward destination',
      bondedAmount: 'bonded amount',
      nominateAndBond: 'Nominate & Bond',
      signAndSubmit: 'Sign & Submit',
      stashController: 'Controller',
      selectAmount: 'Select amount to stake',
      available: 'Available',
      feeInfo: 'Fees of {{fee}} will be applied for submission',
      stashIncreaseAmount: 'Stash Account (increase the amount at stake)',
      stashNoIncreaseAmount: 'Stash Account (do not increase the amount at stake)',
      controllerAccount: 'Controller Account',
      signedSuccess: 'Transaction finished. Bonding was successful!',
      validation: {
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
        'No Ethereum browser extension detected, please install {{name}} to continue here.',
      couldNotRemoveEvent: 'Could not remove the event.',
      endDateGraterThanStartDate: 'End date has to be grater than start date'
    },
    labels: {
      calendar: 'World Calendar',
      staking: 'Staking',
      minimap: 'Minimap',
      musicPlayer: 'Music Player',
      shareLocation: 'Share location',
      information: 'Information',
      settings: 'Settings',
      fullscreen: 'Fullscreen',
      someonesBio: "{{name}}'s Bio",
      myBio: 'My Bio',
      logout: 'Logout',
      worldStats: 'World stats',
      tokenRules: 'Token Rules',
      nameOfInitiative: 'Name of Initiative',
      description: 'Description',
      people: 'People'
    },
    messages: {
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
      returnHighFive: 'Click on the button to high five back!',
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
        'The stage has been enabled right now. Want to participate? Ask to go on stage.'
    },
    titles: {
      alert: 'alert',
      joinSpace: 'join the space',
      returnHighFive: 'Return the favour',
      createSpace: 'YOU CAN CREATE A SPACE FROM YOUR PROFILE',
      ownSpaceInvite: 'WANT YOUR OWN SPACE? (FREE)',
      later: 'later',
      create: 'create',
      stage: 'Stage enabled'
    },
    placeholders: {
      search: 'Search',
      searchForPeople: 'Search for people...'
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
      joinStage: 'Join stage',
      decline: 'Decline',
      cancel: 'Cancel',
      emailLogin: 'Email Login',
      goBack: 'Go back',
      back: 'Back',
      chooseAvatar: 'Choose an image for your avatar',
      saveProfile: 'Save profile',
      selectAccount: 'Select account',
      selectPolkadotAccount: 'Select Polkadot Account To Login',
      copyLink: 'Copy Link',
      createInitiative: 'Launch new initiative',
      flyTo: 'Fly to',
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
      remove: 'yes, remove',
      removeRule: 'remove rule',
      no: 'no, cancel',
      save: 'save',
      launchInitiativeSuccess: 'Launched initiative succesfully, you will be now teleported.',
      lunchingInitiative: 'launching initiative',
      invite: 'Invite',
      invited: 'Invited'
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
        websiteLink: 'Website Link',
        magicLinkDialog: {
          title: 'Magic Link',
          copyLabel: 'Copy Link'
        },
        websiteLinkDialog: {
          title: 'Website Link',
          copyLabel: 'Copy Link'
        },
        flyToSpace: 'Fly To',
        gatheringLink: 'Gathering Magiclink',
        addToCalendar: 'Add to My Calendar',
        joinGathering: 'Join The Gathering',
        by: 'By',
        at: 'At',
        from: 'From',
        to: 'To',
        showMore: 'Show more',
        collapse: 'Collapse'
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
          message: 'You are about to invite a new member to the space "{{spaceName}}".',
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
          successAdd: 'Added User!',
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
      formTitle: 'Well hello weary traveler.',
      helpNote:
        'Your first virtual flight in the Momentiverse can be quite challenging. I am here to\n' +
        '                help you out as your metaphysical, fully knighted neon flamingo. Your personal\n' +
        '                animal spirit guide. Everyone can learn how to fly and navigate Odyssey Momentum\n' +
        '                (even flamingo’s).',
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
        arrowsTextSecond: ' for forward,\n' + '              backward, left and right movement.',
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
      openLabel: 'Expand',
      closeLabel: 'Minimize'
    },
    editProfileWidget: {
      title: 'Edit my bio',
      avatarInstructions: 'Choose an avatar that will be shown when your camera is disabled',
      nameRequired: 'Name field cannot be empty',
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
    }
  }
};
