import GlobalActionButton from "@/components/commons/ActionButton";
import ModalContainer from "@/components/commons/ModalContainer";
import TextInput from "@/components/commons/TextInput";
import { useUserList } from "@/contexts/userListContext";
import { storage } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowPathIcon,
  EnvelopeIcon,
  KeyIcon,
  ListBulletIcon,
  PencilSquareIcon,
  Squares2X2Icon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React from "react";
import { Link } from "react-router-dom";
import { ClimbingBoxLoader } from "react-spinners";
import { toast } from "react-toastify";

const Profile: React.FC = ({}) => {
  //fetch lists of the user from firebase
  const [keywords, setKeywords] = React.useState<string[]>([]);
  const { userData, updateUserInfo, resetPassword, loading } = useAuth();
  const { lists } = useUserList();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");

  React.useEffect(() => {
    setKeywords(userData?.keywords || []);
  }, [userData]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [userImage, setUserImage] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (!userImage) return;
    const uploadProfilePhoto = () => {
      const storageRef = ref(
        storage,
        `/userProfilePhoto/${userData?.id}/${userImage.name}`
      );
      uploadBytesResumable(storageRef, userImage);
      getDownloadURL(storageRef).then((url) => {
        updateUserInfo({
          profilePhoto: url,
        });
      });
    };
    uploadProfilePhoto();
  }, [userImage]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <ClimbingBoxLoader color="red" size={25} />
        </div>
      ) : (
        <div className="h-full w-full grid grid-cols-2 font-light overflow-hidden p-16 gap-6">
          <div className="h-full rounded-3xl flex flex-col p-10 gap-10 shadow-md border border-b-0 justify-between">
            <div
              className="hover:opacity-75 cursor-pointer flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              {userImage || userData?.profilePhoto ? (
                <img
                  src={
                    userImage
                      ? URL.createObjectURL(userImage)
                      : userData?.profilePhoto
                  }
                  className="flex-grow max-h-[40rem] max-w-lg object-contain rounded-3xl"
                />
              ) : (
                <UserIcon className="flex-grow text-white bg-gray-300 rounded-3xl" />
              )}
            </div>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files) setUserImage(e.target.files[0]);
              }}
            />
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-1">
                <UserInfo
                  value={`${userData?.firstName} ${userData?.lastName}`}
                  username
                />
                <UserInfo value={userData?.email} email />
              </div>
              <div className="grid grid-cols-2 gap-6 text-lg">
                <ActionButton
                  profile
                  label="Edit Profile"
                  action={() => setIsOpen(true)}
                />
                <ActionButton
                  password
                  label="Reset Password"
                  action={() => {
                    resetPassword();
                    toast.success(
                      "Password reset link sent to your email, please reset and try signing in again."
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 overflow-hidden p-1 rounded-3xl">
            <UserPrefs
              label="Keywords"
              prefArray={keywords}
              keyword
              onAdd={(keyword) => {
                setKeywords([...keywords, keyword]);
                updateUserInfo({ keywords: [...keywords, keyword] });
              }}
              onRemove={(index) => {
                const newKeywords = [...keywords];
                newKeywords.splice(index, 1);
                setKeywords(newKeywords);
                updateUserInfo({ keywords: newKeywords });
              }}
            />
            <UserPrefs label="Lists" prefArray={lists} list />
          </div>
          <ModalContainer
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Edit Info"
            action="Save"
            handleAction={() => {
              updateUserInfo({
                firstName: firstName || userData?.firstName,
                lastName: lastName || userData?.lastName,
              });
              setIsOpen(false);
            }}
            buttonColor="bg-green-500"
          >
            <div className="grid grid-cols-2 gap-2">
              <TextInput
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextInput
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </ModalContainer>
        </div>
      )}
    </>
  );
};

export default Profile;

const UserInfo: React.FC<{
  value: string;
  username?: boolean;
  email?: boolean;
}> = ({ value, email = false, username = false }) => {
  return (
    <div className="flex items-center gap-5">
      {username && <UserIcon className="h-9 text-red-600" />}
      {email && <EnvelopeIcon className="h-9 text-red-600" />}
      <p className="text-xl">{value}</p>
    </div>
  );
};

export const ActionButton: React.FC<{
  label: string;
  profile?: boolean;
  password?: boolean;
  action?: () => void;
}> = ({ label, profile = false, password = false, action = () => {} }) => {
  return (
    <>
      <div
        role="button"
        className="flex items-center gap-3 rounded-3xl bg-red-600 text-white p-2 justify-center transition-all ease-in hover:-translate-y-2"
        onClick={action}
      >
        {profile && <PencilSquareIcon className="h-8" />}
        {password && <ArrowPathIcon className="h-8" />}
        <p>{label}</p>
      </div>
    </>
  );
};

export const UserPrefs: React.FC<{
  prefArray: any[];
  label: string;
  keyword?: boolean;
  list?: boolean;
  onAdd?: (keyword: string) => void;
  onRemove?: (index: number) => void;
}> = ({
  prefArray,
  label,
  keyword = false,
  list = false,
  onAdd = () => {},
  onRemove = () => {},
}) => {
  const [newKeyword, setNewKeyword] = React.useState<string>("");

  return (
    <div className="h-full p-5 rounded-3xl flex flex-col gap-5 overflow-hidden shadow-md border border-b-0 tracking-tighter">
      <div className="flex items-center gap-2">
        {keyword && <KeyIcon className="h-9 text-red-600" />}
        {list && <ListBulletIcon className="h-9 text-blue-500" />}
        <p className="text-2xl">{label}</p>
      </div>
      {keyword ? (
        <div className="grid grid-cols-10 items-center gap-2">
          <TextInput
            label="Keyword"
            containerStyle="col-span-8"
            inputStyle="p-2"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
          />
          <div
            role="button"
            className="flex items-center justify-center gap-1 bg-green-500 text-white col-span-2 p-2 rounded-lg"
            onClick={() => {
              onAdd(newKeyword);
              setNewKeyword("");
            }}
          >
            <Squares2X2Icon className="h-5" />
            <p>Add</p>
          </div>
        </div>
      ) : null}
      <div className="bg-gray-100 flex-grow rounded-3xl p-5 space-y-2 overflow-y-scroll border scrollbar-hide">
        {prefArray.map((pref, index) => (
          <div
            key={index}
            className="flex border rounded-3xl items-center bg-white p-2 px-4 w-full justify-between"
          >
            <p className="max-w-sm truncate tracking-wide">
              {list ? pref.name : pref}
            </p>
            {keyword ? (
              <GlobalActionButton remove action={() => onRemove(index)} />
            ) : list ? (
              <Link to={`/dashboard/lists/${pref.id}`} state={{ ...pref }}>
                <GlobalActionButton details action={() => {}} />
              </Link>
            ) : null}
          </div>
        ))}
        {prefArray.length === 0 && (
          <p className="text-center text-gray-400">
            No {label.toLowerCase()} added yet
          </p>
        )}
      </div>
    </div>
  );
};
