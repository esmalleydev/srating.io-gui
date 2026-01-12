'use client';

import Style from '@/components/utils/Style';
import BackButton from '../BackButton';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Typography from '@/components/ux/text/Typography';
import Objector from '@/components/utils/Objector';
import { useTheme } from '@/components/hooks/useTheme';
import IconButton from '@/components/ux/buttons/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';
import Menu, { MenuOption } from '@/components/ux/menu/Menu';
import Modal from '@/components/ux/modal/Modal';
import Button from '@/components/ux/buttons/Button';
import { setLoading } from '@/redux/features/loading-slice';
import { setDataKey } from '@/redux/features/fantasy_group-slice';
import { useClientAPI } from '@/components/clientAPI';
import { FantasyDraftOrders, FantasyGroup, FantasyGroupUsers } from '@/types/general';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import { FantasyGroupLoadData } from './Contents/Home/Client';


const getNavHeaderHeight = () => {
  return 42;
};

export { getNavHeaderHeight };

type ModalData = {
  title: string;
  message: string;
  button: string;
  action: () => void;
}

type LockResponse = {
  fantasy_group: FantasyGroup;
  fantasy_draft_orders: FantasyDraftOrders;
}


const NavBar = () => {
  const theme = useTheme();

  const [anchor, setAnchor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData>({} as ModalData);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);
  const fantasy_entrys = useAppSelector((state) => state.fantasyGroupReducer.fantasy_entrys);
  const isOwner = useAppSelector((state) => state.fantasyGroupReducer.isOwner);
  const open = Boolean(anchor);


  const divStyle = Objector.extender(
    Style.getNavBar(),
    {
      justifyContent: 'space-between',
      backgroundColor: theme.background.main,
      padding: '0px 10px',
    },
  );

  const handleOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const handleLock = () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    dispatch(setLoading(true));

    useClientAPI({
      class: 'fantasy_group',
      function: 'lock',
      arguments: {
        fantasy_group_id: fantasy_group.fantasy_group_id,
      },
    }).then((data: LockResponse) => {
      setIsLoading(false);
      dispatch(setLoading(false));
      console.log(data);
      dispatch(setDataKey({ key: 'fantasy_group', value: data.fantasy_group }));
      dispatch(setDataKey({ key: 'fantasy_draft_orders', value: data.fantasy_draft_orders }));
      setModalOpen(false);
    }).catch((err) => {
      // nothing for now
    });
  };


  const handleLeaveGroup = () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    dispatch(setLoading(true));

    useClientAPI({
      class: 'fantasy_group',
      function: 'leave',
      arguments: {
        fantasy_group_id: fantasy_group.fantasy_group_id,
      },
    }).then((data: FantasyGroupLoadData) => {
      setIsLoading(false);
      dispatch(setLoading(false));
      console.log(data);
      dispatch(setDataKey({ key: 'fantasy_group_users', value: data.fantasy_group_users }));
      setModalOpen(false);
    }).catch((err) => {
      // nothing for now
    });
  };

  const handleDeleteGroup = () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    dispatch(setLoading(true));

    useClientAPI({
      class: 'fantasy_group',
      function: 'remove',
      arguments: {
        fantasy_group_id: fantasy_group.fantasy_group_id,
      },
    }).then((data: LeaveResponse) => {
      setIsLoading(false);
      dispatch(setLoading(false));
      console.log(data);
      // dispatch(setDataKey({ key: 'fantasy_group', value: data.fantasy_group }));
      // dispatch(setDataKey({ key: 'fantasy_draft_orders', value: data.fantasy_draft_orders }));
      setModalOpen(false);
    }).catch((err) => {
      // nothing for now
    });
  };

  const options: MenuOption[] = [];

  if (isOwner && !fantasy_group.locked) {
    options.push({
      value: 'lock',
      label: 'Lock group',
      selectable: true,
      onSelect: () => {
        setModalOpen(true);
        setModalData({
          title: 'Lock league?',
          message: 'After locking the league, you can not change it. People can not join a locked league. This action can not be undone. The draft will be generated and will begin at the configured time.',
          button: 'Confirm',
          action: handleLock,
        });
        handleClose();
      },
      icon: <LockIcon fontSize='small' />,
    });
  }

  if (isOwner && false) {
    options.push({
      value: 'del',
      label: 'Delete group',
      selectable: true,
      onSelect: () => {
        setModalOpen(true);
        setModalData({
          title: 'Delete group?',
          message: 'Group and all related data will be deleted. This action can not be undone. Are you sure?',
          button: 'Confirm',
          action: handleLeaveGroup,
        });
        handleClose();
      },
      icon: <DeleteIcon fontSize='small' style = {{ color: theme.error.main }} />,
    });
  }

  if (!isOwner) {
    options.push({
      value: 'leave',
      label: 'Leave group',
      selectable: true,
      onSelect: () => {
        setModalOpen(true);
        setModalData({
          title: 'Leave group?',
          message: 'After leaving the group, all your entries will be deleted. Any entry fees will not be refunded. You can rejoin the group if it is public or you are invited again. Are you sure?',
          button: 'Confirm',
          action: handleLeaveGroup,
        });
        handleClose();
      },
      icon: <LogoutIcon fontSize='small' style = {{ color: theme.error.main }} />,
    });
  }


  return (
    <>
      <div className={Style.getStyleClassName(divStyle)}>
        <div><BackButton /></div>
        <IconButton
          value = 'settings'
          onClick={handleOpen}
          icon = {<SettingsIcon />}
        />
        <Menu
          anchor={anchor}
          open={open}
          onClose={handleClose}
          options = {options}
        />
      </div>
      <Modal
        open = {modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <Typography type = 'h6'>{modalData.title}</Typography>
        <Typography type = 'caption' style = {{ color: theme.text.secondary }}>{modalData.message}</Typography>
        <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
          <Button value = 'cancel' title = 'Cancel' ink handleClick={() => setModalOpen(false)} />
          <Button value = 'handleit' title = {modalData.button} handleClick={modalData.action} />
        </div>
      </Modal>
    </>
  );
};

export default NavBar;
