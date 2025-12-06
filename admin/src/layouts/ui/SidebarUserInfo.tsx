import { UserButton, useUser } from "@clerk/clerk-react";

const SidebarUserInfo = () => {
  const { user, isLoaded } = useUser();

  return (
    <div className="flex items-center gap-3 border-t border-base-300 pt-4">
      {!isLoaded ? (
        <div className="loading loading-spinner"></div>
      ) : (
        <>
          <UserButton />
          <div>
            <p className="font-semibold leading-tight">
              {user?.fullName}
            </p>
            <p className="text-xs opacity-75 leading-tight">
              {user?.emailAddresses[0].emailAddress}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarUserInfo;