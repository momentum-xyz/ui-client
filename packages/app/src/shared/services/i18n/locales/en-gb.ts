export const enGb = {
  translation: {
    time: {
      days: '{{days}} days',
      hours: '{{hours}} hours',
      minutes: '{{minutes}} minutes',
      seconds: '{{seconds}} seconds'
    },
    staking: {
      title: 'Personal Connecting Dashboard',
      label: 'Staking',
      startLabel: '1. Start Connecting',
      walletLabel: '2. My Wallet',
      confirmLabel: '3. Authorize',
      walletTitle: 'My Wallet',
      confirmTitle: 'Authorize',
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
      authorizeContribution: 'Authorize your contribution',
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
      activeStakes: 'Active Stakes',
      balance: 'Balance',
      changeNominator: 'change nominator',
      stakingWalletAccountHeading: 'Staking Wallet Account',
      pickAccount: 'Pick a wallet account',
      pickDestination: 'Pick a reward destination',
      stashLabel: 'stash',
      rewardDestination: 'reward destination',
      specificDestination: 'Specific Destination',
      dockingAmount: '{{docking}} docking',
      connectionAmount: '{{connections}} connections',
      eventAmount: '{{events}} events',
      requestAirdrop: 'Get tokens',
      requestAirdropSuccess: 'Request for airdrop was successful',
      requestAirdropFailed: 'Request for airdrop failed',
      nextAirdropAvailableOn: 'Next airdrop available at {{date}}',
      processingAirdropRequest: 'Please wait 10-15 seconds for the transaction',
      unbondAmount: 'Unbond Amount',
      setAmount: 'Set Amount',
      setAmountSymbol: 'Set Amount, {{symbol}}',
      nominateAndBond: 'Nominate & Bond',
      amount: 'Amount',
      tokenAmount: 'Amount, {{amount}}',
      stakedAmount: 'Staked {{amount}}',
      back: 'Back',
      next: 'Next',
      destination: 'Destination',
      signAndSubmit: 'Sign & Submit',
      signAndConnect: 'Sign & Connect',
      unStakeContribution: 'Unstake your contribution',
      contributionMessage:
        'This account is also the destination for the rewards you receive from your contribution.',
      stakingMessage:
        'By staking Momentum ($MOM) in someones Odyssey you are showing support for their journey. Not only do you get rewards for staking, but it will also allow you to place a portal inside your Odyssey that will allow others to travel to the Odyssey you have staked in.',
      connectMessage:
        'You can freely visit any users open Odyssey. You can explore and meet them just by clicking on their Odyssey. However, to create a portal between your Odyssey and another users Odyssey, you will need to stake in them. By staking you show your support for another Odyssey.',
      connectTitle: 'Connect to another Odyssey',
      startContributing: 'Start Contributing',
      guestStakingMessage: 'Connecting and Staking are on-chain actions that require a wallet',
      guestWalletMessage: 'Here is how to create and connect your wallet to Odyssey',
      unStakeFrom: 'Unstake From',
      unStake: 'Unstake',
      errorUnstake: 'Error unstaking',
      successUnstake: 'Congratulations, you successfully unstaked {{amount}} from {{name}}',
      errorGetRewards: 'Error getting rewards',
      successGetRewards: 'Congratulations, you successfully claimed your MOM rewards!',
      getRewards: 'Get Rewards',
      error: 'Oops! Your request failed, please try again!',
      stakeSuccess: 'Congratulations, you successfully staked {{amount}} MOM in {{name}}',
      stakeSuccessTitle: 'Staking successful!',
      stakeErrorTitle: 'Staking failed!',
      unStakeSuccessTitle: 'Unstaking successful! ',
      unStakeErrorTitle: 'Unstaking failed!',
      rewardSuccessTitle: 'Rewards claim successful!',
      rewardErrorTitle: 'Rewards claim failed!',
      airdropSuccessTitle: 'Airdrop successful!',
      airdropErrorTitle: 'Airdrop failed!',
      totalRewards: 'Total rewards',
      rewards: 'Rewards',
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
      title: "You're using an unsupported browser. Browsers that are currently supported:",
      browserList: 'Google Chrome, Mozilla Firefox.'
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
      nameConstraints: 'Please enter a name with 2-32 characters',
      somethingWentWrong: 'Something went wrong',
      somethingWentWrongTryAgain: 'Something went wrong. Please try again later.',
      noWorldBuilderPermissions:
        'Your Account is not whitelisted;\nPlease contact support to request a whitelist slot or login to a different whitelisted account',
      savingSpaceDetailsError: 'An error has occurred while saving space.',
      failedToLoadDynamicScript: 'Failed to load dynamic script: {{url}}',
      noModuleSpecified: 'No module specyfied',
      errorWhileLoadingPlugin: 'An error has occured while loading plugin',
      onlyGLBSupported: 'Only GLB format supported',
      requiredField: 'This field is required',
      errorLoadingToken: 'Error loading {{tokenSymbol}}',
      errorLoadingNFT: 'Error loading NFT'
    },
    systemMessages: {
      loadedInAnotherTab: 'Odyssey has been loaded in another browser tab',
      switchToThatTab:
        'To continue the experience, please switch to that window/tab and close this one',
      underMaintenance: 'The server is undergoing maintenance, please try again later',
      noBlockchainUrlAvailable:
        'Ooops, the blockchain server is not available at the moment. Please try again later!'
    },
    counts: {
      people_one: '{{count}} Person',
      people_other: '{{count}} People',
      attendees_one: `{{count}} Attendee`,
      attendees_other: `{{count}} Attendees`,
      vibes_one: '{{count}}  vibe',
      vibes_other: '{{count}}  vibes',
      skyboxes_one: '{{count}} Skybox',
      skyboxes_other: '{{count}} Skyboxes'
    },
    labels: {
      home: 'Home',
      screenShare: 'Screenshare',
      stageMode: 'Stage Mode',
      calendar: 'World Calendar',
      emoji: 'EMOJI',
      staking: 'Staking',
      minimap: 'Minimap',
      musicPlayer: 'Music Player',
      shareLink: 'Share link',
      shareLinkOfOdyssey: 'Share link of Odyssey',
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
      audioVideoSettings: 'Audio/Video Settings',
      grabTable: 'Grab a Table',
      videoinput: 'Video Input',
      audioinput: 'Audio Input',
      audiooutput: 'Audio Output',
      nameWorld: 'Name World',
      worldURL: 'World URL',
      subdomain: 'Subdomain',
      pilot: 'Pilot',
      flyWithMe: 'Fly with me',
      search: 'Search',
      voiceChat: 'Voice chat',
      chat: 'Chat',
      voice: 'Voice',
      notifications: 'Notifications',
      micOn: 'Mic On',
      micOff: 'Mic Off',
      selectFunction: 'Select Function',
      visibleInNavigation: 'Visible in Navigation',
      basicAssetPack: 'Basic Asset Pack',
      customObjectLibrary: 'Custom Object Library',
      uploadCustomObject: 'Upload Custom Object',
      changeVideo: 'Change Video',
      video: 'Video',
      changeText: 'Change Text',
      document: 'Document',
      changeImage: 'Change Image',
      image: 'Image',
      coCreate: 'co-create',
      connected: 'connected',
      connect: 'connect',
      highFive: 'high five',
      visit: 'visit',
      flyToMe: 'Fly to me',
      bio: 'Bio',
      discoverMore: 'Discover more',
      connections: 'Connections',
      newsfeed: 'Newsfeed',
      changeMusic: 'Change Music (coming soon)',
      tokenGating: 'Token Gating (coming soon)',
      addObject: 'Add Object',
      skybox: 'Skybox',
      connectYourWallet: 'Connect your wallet'
    },
    messages: {
      loading: 'Loading Odyssey',
      loadingPlugin: 'Loading Plugin...',
      loadingToken: 'Loading {{tokenSymbol}}...',
      loadingDynamicScript: 'Loading dynamic script: {{url}}',
      signUp_one:
        'You need a wallet to get started. If you already have one, click on "Create your Odyssey". Or read more about getting a wallet on ',
      signUp_two:
        'You need a wallet to create your own Odyssey. If you already have one, you will see a pop-up asking for the address you would like to use or create. If you do not have a wallet, please install a browser plugins and refresh the page',
      orSignIn: 'Or if you already have an account please sign in',
      howSignUp: 'How to create an Odyssey',
      onlineArena: 'Online Mass Collaboration Arena',
      loading30sec: 'If Odyssey does not load within 30 seconds, please',
      clearCache: 'Clear your cache',
      version: 'Odyssey version {{version}}',
      welcome: "Login successful. We invite you to Odyssey's intro. Hit play below!",
      loginSuccessful: 'Login Successful',
      playFriggin: 'Play the Friggin’ Intro',
      noResultsFound: 'No results found',
      worldBuilderSignIn: 'Sign In to your Odyssey Account',
      linkCopied: 'The link is copied to your clipboard.',
      fullyEnjoy: 'Connect your wallet to fully enjoy Odyssey!',
      flyAround: 'Fly around and start experiencing Odyssey!',
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
      deleteNamedObject: 'Are you sure you want to delete "{{name}}"?',
      removeEventSuccess: 'Removed event successfully.',
      avatarSuccess: 'Avatar saved successfully',
      avatarFailure: 'There was a problem saving the avatar',
      spaceEditSuccess: 'Successfully edited space',
      spaceSaveFailure: 'There was an error saving the space',
      spaceDeleteFailure: 'There was an error deleting the space',
      joinSpaceWelcome: 'Click on the button to join the space!',
      spaceInvitationNote: '{{invitor}} has invited you to {{spaceName}}',
      joinTableWelcome: 'Click on the button to join the table!',
      grabTableInvitationNote: '{{invitor}} has invited you to join a table',
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
      subSpaceCreateSuccess: 'The subspace was created successully!',
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
        'Odyssey has detected a new {{deviceKind}} device named "{{deviceName}}". Do you want to switch to it?',
      inviteSuccess: 'You have successfully invited {{user}} to the space',
      inviteError: 'There was a problem inviting {{user}} to space',
      areYouSureYouWantToRemoveUserFromStage: `Are you sure you want remove {{name}} from stage?`,
      wouldYouLikeToGoOnStage: 'Would you like to go on stage?',
      thisWillEnableYouToUseStage:
        '(This will enable you to talk, screenshare, and transmit video)',
      pleaseTryAgainLater: 'Please try again later',
      videoLimitReached: 'Video limit reached',
      stageFull: 'Stage full',
      worldBuilderDescription:
        'This is the Odyssey creator - a place where you can create your own decentralised social metaverse. Take ownership of your own world to build and create together. Shape your metaverse to suit your needs, enable the functionality you want to use and invite the people you want to collaborate with.',
      startBuilding: 'Connect your wallet\n To start Building',
      savingSpaceDetailsSuceess: 'Space details saved succesfully!',
      stageIsFullTryAgain: 'Stage is full, please try again later...',
      flyWithMeEnabled: 'Fly with me enabled',
      flyWithMeActivated: 'Fly with me has been activated',
      flyWithMeDisabled: 'Fly with me has been disabled',
      flyWithMeBlocked: 'During fly with me mode, some functionality has been disabled',
      flyWithMeEnjoy: 'Sit back, relax and enjoy the ride.',
      deletePluginConfirmation: 'Are you sure you want to remove {{pluginName}}?',
      pluginRemovedSuccessfully: '{{pluginName}} removed succesfully!',
      errorWhileRemovingPlugin:
        'Error has occured when removing {{pluginName}} removed succesfully!',
      weSupportGLBModels: 'We support GLB Models',
      selectOne: 'Select One',
      processing: 'Processing',
      comingSoonExclamation: 'Coming Soon!',
      mintingYourOdyssey: 'Minting your Odyssey...',
      mintingYourOdysseyWarning: "Please wait and don't refresh, this may take a while.",
      congratulations: 'Congratulations!',
      recievedAmmountOfTokensMessage:
        "You just received {{amount}} tokens. One more step and you'll embark on your epic journey!",
      onceConnectedTokensWillBeAwarded:
        'Once connected, you will be awarded some Drive tokens to get you started',
      noWalletFollowInstructions: 'No wallet? You can get one following the instructions'
    },
    titles: {
      alert: 'alert',
      joinSpace: 'join the space',
      joinTable: 'join the table',
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
      broadcastManage: 'Manage Broadcast',
      profile: 'Profile',
      broadcast: 'Broadcast',
      name: 'Name',
      template: 'Template',
      generate: 'Generate',
      worldBuilder: 'Odyssey Creator',
      worldChat: 'World Chat',
      templateNameWrapper: '{{name}} Template',
      stageIsFull: 'Stage is full',
      success: 'Success',
      plugins: 'Plugins',
      addPlugin: 'Add Plugin',
      deletePluginFromSpace: 'Delete plugin from space',
      error: 'Error',
      social: 'Social',
      selectFunctionality: 'Select Functionality',
      spawnAsset: 'Spawn Asset',
      selectedSkybox: 'Selected Skybox',
      upload3dAsset: 'Upload 3D Asset',
      admin: 'Admin',
      owner: 'Owner',
      statistics: 'Statistics',
      oneConnectYourWallet: '1. Connect your wallet'
    },
    textMessage: {
      you: 'you',
      placeholder: 'Message',
      joinText: '{{name}} has joined the collaboration space',
      leftText: '{{name}} has left the collaboration space',
      flyWithMeInvite: '{{name}} has invited you to join them in fly with me',
      flyWithMeDisabled: '{{name}} has disabled fly with me'
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
      searchForAttendees: 'Search for attendees...',
      nameYourWorld: 'Name your world',
      worldname: 'worldname',
      selectPlugin: 'Select Plugin',
      nameYourAssetForYourLibrary: 'Name your Asset for your library',
      selectAnOption: 'Select an Option',
      nameYourObjectNavigation: 'Name your Object (Navigation)',
      selectAccount: 'Select Account'
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
      add: 'Add',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      createOdyssey: 'Create your Odyssey',
      createOrSignIn: 'Create an account or sign in',
      approve: 'Approve',
      joinStage: 'Join Stage',
      decline: 'Decline',
      cancel: 'Cancel',
      react: 'React',
      emailLogin: 'Email Login',
      goBack: 'Go back',
      back: 'Back',
      muteAll: 'Mute All',
      rejoinMeeting: 'Rejoin meeting',
      clickHere: 'Click here',
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
      connect: 'Connect',
      connected: 'Connected',
      coCreate: 'co-create',
      dock: 'Dock',
      visit: 'Visit',
      saveChanges: 'Save changes',
      approving: 'approving',
      approved: 'approved',
      delete: 'Delete',
      declined: 'declined',
      declining: 'declining',
      removed: 'removed',
      removing: 'removing',
      joined: 'Joined',
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
      kickNameFromVoice: 'Kick {{name}} from Voice',
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
      inviteThisPersonToTheStage: 'Invite this person to the stage?',
      logIn: 'Log In',
      getStarted: 'Get Started',
      selectTemplate: 'Select Template',
      generateWorld: 'Generate World',
      disengageReturn: 'Disengage And Return',
      join: 'join',
      dismiss: 'dismiss',
      joinVoiceChat: 'Join Voice Chat',
      leaveVoiceChat: 'Leave Voice Chat',
      select: 'Select',
      uploadYourAssset: 'Upload your asset',
      addToLibrary: 'Add to library',
      dropItHere: 'Drop it here',
      closePanel: 'Close Panel',
      selectSkybox: 'Select Skybox',
      upload: 'Upload',
      spawnObject: 'Spawn Object',
      change: 'Change',
      changeVideo: 'Change Video',
      changeText: 'Change Text',
      changeImage: 'Change Image',
      selectImage: 'Select Image',
      move: 'Move',
      rotate: 'Rotate',
      scale: 'Scale',
      undo: 'Undo',
      redo: 'Redo',
      copy: 'Copy',
      functionality: 'Functionality',
      addTokenGate: 'Add Token Gate'
    },
    descriptions: {
      worldName: 'This is the name of the metaverse you will be creating',
      worldSubdomain:
        'This is the subdomain of the publicly facing URL that people will visit when then visiting your metaverse',
      worldURL:
        'This is the publicly facing URL that people will visit when then visiting your metaverse'
    },
    fileUploader: {
      uploadLabel: 'Upload Image',
      changeLabel: 'Change Image',
      dragActiveLabel: 'Drop the files here...'
    },
    assetsUploader: {
      uploadLabel: 'Upload .glb file',
      dragActiveLabel: 'Drop the files here...',
      spaceName: 'Space Name',
      successMessage: 'Asset successfully uploaded',
      errorUnsupportedFile: 'Only .glb files are supported',
      errorTooLargeFile: 'Max file size is 50.1MB',
      errorSave: 'Error uploading asset'
    },
    eventList: {
      noGatherings: 'There are no gatherings scheduled for this space.',
      eventItem: {
        live: 'Live',
        websiteLink: 'Learn More',
        moreAttendees: 'More attendees',
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
      errorMessage: 'This field is required',
      createSuccess: 'Event created successfully',
      createFailed: 'There was a problem creating the event'
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
      subtitle: 'Manage Broadcast',
      formTitle: 'broadcast',
      formDescription:
        'Broadcasting allows you to send out a message to this space and the spaces below. Add a youtube url to start broadcasting. What would you like to broadcast?',
      formInstruction: 'Add a youtube url which you would like to broadcast:',
      formInputLabel: 'youtube video url',
      formErrorMessage: 'Please enter a valid Youtube URL',
      formButton: 'preview',
      formInfo: 'The broadcast will be sent to the following spaces and their subspaces:',
      previewTitle: 'preview',
      broadcastStart: 'start broadcasting',
      broadcastStartDialog: 'Starting Broadcast',
      broadcastStartMessage: 'Streaming is about to start',
      broadcastStop: 'stop broadcasting',
      broadcastStopMessage: 'Are you sure you want to end the broadcast?',
      broadcastStopTitle: 'End broadcast',
      confirmStop: 'Yes, end broadcast',
      cancelStop: 'No, cancel',
      enableSuccess: 'The video has broadcast successfully',
      enableError: 'There was a problem broadcasting this video',
      disableSuccess: 'Broadcasting has disabled successfully',
      disableError: 'There was a problem disabling the broadcast'
    },
    liveStream: {
      subtitle: 'Live Stream',
      stopStream: 'Stop streaming'
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
      manageEmoji: {
        title: 'Emoji',
        text1:
          'To upload an emoji to the Emoji Palette, upload a static PNG file which is 512 x 512 pixels in size or greater. Transparency is supported. Once uploaded this emoji will be usable all over the metaverse by anyone.',
        noEmojiUploaded: 'This space has no emoji uploaded yet.',
        yourUploadedEmoji: 'Your uploaded Emoji:',
        deleteEmoji: 'Delete Emoji',
        uploadEmoji: 'Upload EMoji',
        uploadDialog: {
          title: 'Upload your emoji',
          emojiName: 'Name',
          errorMissingName: 'Please enter a name for your emoji',
          selectImage: 'Select Image',
          changeImage: 'Change Image',
          confirmButton: 'Save',
          errorSave: 'Could not save emoji. Please try again later',
          successSave: 'Emoji uploaded successfully',
          errorDeleteOld: 'Could not delete old emoji. Please try again later'
        },
        deleteDialog: {
          title: 'Delete emoji',
          text: 'Are you sure you want to delete the emoji?',
          yes: 'Yes, delete',
          no: 'No, cancel',
          errorDelete: 'Could not delete emoji. Please try again later',
          successDelete: 'Emoji deleted successfully.'
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
        'You are about to embark on your flight in Odyssey.\n\n Below we have a good dose of the essentials for you to get started.\n\n We have long term plans with Odyssey, yet we are at humble beginnings with the release of this first milestone. We are so delighted you are flying with us!\n\n We invite you to help us improve Odyssey, as we are at humble beginnings with the release of this first milestone. So...\n\n Something doesn’t work for you? Let us know!\n Something you are missing? Let us know!\n Something you feel should be different? Let us know!\n\nWant to help building Odyssey? Let us know ;)',
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
      emoji: {
        title: "Emoji and Megamoji's",
        paragraphs: {
          one: {
            partOne:
              'Want to let people know how you are feeling, or if you agree or disagree with something behind said? Let everyone know your opinion by expressing yourself using ',
            highlightedPart: 'Emojis',
            partTwo: '.'
          },
          two: {
            partOne: 'The ',
            highlightedPart: 'EMOJI BUTTON',
            partTwo:
              ', is located at the bottom left hand corner of the UI, click on it to bring up a selection of emojis.'
          },
          three: {
            partOne:
              'Selecting one of the emojis from this palette will cause the emoji of your choice to appear near you inside the metaverse - visible to everyone around you! This not only works while flying in the ',
            highlightedPartOne: '3D SPACE',
            partTwo: ', using it while inside a ',
            highlightedPartTwo: 'DASHBOARD',
            partThree: ' will cause your emoji to appear to everyone inside that dashboard!'
          },
          four: {
            partOne: 'When a group of people all feel the same way, something ',
            highlightedPart: 'AWESOME',
            partTwo: ' may happen!'
          }
        }
      },
      momentum: {
        title: 'Odyssey Space',
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
            highlightedPart: 'the Calendar on our Odyssey space',
            partTwo:
              ' or updates on topics. Want to be a guest speaker and share your insights with the community? Do reach out to us on Discord.'
          },
          four: 'Wanna chat, or have any more questions, crazy ideas or suggestions to us? Check out our momentum space. LFG!'
        },
        visitSpace: 'Visit the Odyssey Space',
        visitSpaceDisabled: 'Disabled during Fly with me'
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
      saveFailure: 'Could not save Profile.',
      changeAvatar: 'Change your avatar',
      upload: 'upload',
      avatar: 'avatar'
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
      unityVolume: 'Sound Effects Volume'
    },
    collaboration: {
      spaceIsPrivate: 'This space is set to private by its admin and only accessible by its members'
    },
    calendar: {
      formButton: 'Create new event in your Odyssey',
      subTitle: 'Calendar'
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
    },
    mutualConnections: {
      noConnection: 'There are no connections yet',
      title: 'Mutual connections list',
      admin: 'admin'
    },
    newsfeed: {
      stakedIn: ' staked in ',
      you: 'You',
      and: ' and ',
      docked: ' docked'
    }
  }
};
