import { observer } from "mobx-react-lite";
import React from "react";
import { useStores } from "../../store";
import DefaultFormModal from "./DefaultFormModal";
import AddOrgForm from "../forms/AddOrgForm";
import AddNicknameForm from "../forms/AddNicknameForm";

export default observer(() => {
  const { aws } = useStores();

  return (
    <>
      <AddOrg open={aws.addingOrg} onClose={() => aws.setAddingOrg(false)} />

      <AddNickname
        open={!!aws.orgAddingNicknameTo}
        onClose={() => aws.setAddingNicknameToOrg("")}
        ssoStartUrl={aws.orgAddingNicknameTo}
      />
    </>
  );
});

type FormProps = {
  onClose: () => void;
  open: boolean;
};
const AddOrg = (props: FormProps) => {
  if (!props.open) return null;

  return (
    <DefaultFormModal header="Add an organisation" onDismiss={props.onClose}>
      <AddOrgForm onClose={props.onClose} />
    </DefaultFormModal>
  );
};

const AddNickname = (props: FormProps & { ssoStartUrl: string }) => {
  if (!props.open) return null;

  return (
    <DefaultFormModal header="Add a nickname" onDismiss={props.onClose}>
      <AddNicknameForm {...props} />
    </DefaultFormModal>
  );
};
