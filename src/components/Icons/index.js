import Image from "next/image";
import { useRouter } from "next/router";

export const GettingStartedIcon = () => (
  <Image
    layout="fixed"
    src="/images/started-img.png"
    alt=""
    width={30}
    height={30}
  />
);

export const Objection = () => {
  return (
    <Image
      layout="fixed"
      src="/images/rhmicons/objection.png"
      alt="objection"
      width={18}
      height={18}
    />
  );
};

export const GetKgtinIcon = () => (
  <Image
    layout="fixed"
    src="/images/ID img.png"
    alt=""
    width={30}
    height={30}
  />
);

export const KgtinIcon = () => (
  <Image
    layout="fixed"
    src="/images/TIN img.png"
    alt="Tin Icon"
    width={30}
    height={30}
  />
);
export const TaxpayerIcon = () => (
  <Image layout="fixed" src="/images/TP.png" alt="" width={30} height={30} />
);
export const TokenIcon = () => (
  <Image layout="fixed" src="/images/token.png" alt="" width={30} height={30} />
);

export const PasswordIcon = () => (
  <Image
    layout="fixed"
    src="/images/pw img.png"
    alt=""
    width={30}
    height={30}
  />
);
export const PasswordIcon2 = () => (
  <Image
    layout="fixed"
    src="/images/pw2 img.png"
    alt=""
    width={30}
    height={30}
  />
);
export const PasswordShowIcon = () => (
  <Image layout="fixed" src="/images/see.png" alt="" width={15} height={15} />
);
export const PasswordHideIcon = () => (
  <Image layout="fixed" src="/images/nosee.png" alt="" width={15} height={15} />
);

export const KgirsLogo = () => {
  return (
    <Image
      layout="fixed"
      src="/images/logo1.png"
      alt=""
      width={203.6}
      height={38.4}
    />
  );
};

export const HazardIcon = () => {
  return (
    <Image
      layout="fixed"
      src="/images/warning.png"
      alt=""
      width={35}
      height={25}
    />
  );
};

//table icons
export const SuccessIcon = () => {
  return (
    <Image
      layout="fixed"
      src="/images/icons/succ.png"
      alt=""
      width={13}
      height={13}
    />
  );
};
export const PendingIcon = () => {
  return (
    <Image
      layout="fixed"
      src="/images/icons/pend.png"
      alt=""
      width={13}
      height={13}
    />
  );
};

//dashboard icons
export const TotalRemittance = () => {
  return (
    <Image
      layout="fixed"
      src="/images/icons/approved.png"
      alt=""
      width={35}
      height={35}
    />
  );
};

export const PendingRemittance = () => {
  return (
    <Image
      layout="fixed"
      src="/images/icons/totalapproved.png"
      alt=""
      width={35}
      height={35}
    />
  );
};


export const RevenueItems = () => {
  return (
    <Image
      layout="fixed"
      src="/images/icons/collected.png"
      alt=""
      width={35}
      height={35}
    />
  );
};

export const TaxReceipt = () => {
  return (
    <Image
      layout="fixed"
      src="/images/icons/outstanding.png"
      alt=""
      width={35}
      height={35}
    />
  );
};

export const Unassessed = () => {
  return (
    <Image
      layout="fixed"
      src="/images/icons/unassed.png"
      alt=""
      width={35}
      height={35}
    />
  );
};

//navigation icons
export const Dashboard = () => {
  const router = useRouter();
  let { pathname } = { ...router };
  if (pathname === "/dashboard") {
    return (
      <div className="mx-6 flex items-center">
        <Image
          layout="fixed"
          src="/images/icons/dashboard_blu.png"
          alt="login"
          width={18}
          height={18}
        />
      </div>
    );
  }
  return (
    <div className="mx-6 flex items-center">
      <Image
        layout="fixed"
        src="/images/icons/dashboard.png"
        alt="login"
        width={18}
        height={18}
      />
    </div>
  );
};

export const RhmDashboard = () => {
  return (
    <div className="mx-6 flex items-center">
      <Image
        layout="fixed"
        src="/images/rhmicons/dashboard.png"
        alt=""
        width={18}
        height={18}
      />
    </div>
  );
};

export const ManageTaxpayer = () => {
  return (
    <div className="mx-6 flex items-center">
      <Image
        layout="fixed"
        src="/images/rhmicons/manage_taxpayer.png"
        alt=""
        width={18}
        height={18}
      />
    </div>
  );
};

export const ManageUser = () => {
  return (
    <div className="mx-6 flex items-center">
      <Image
        layout="fixed"
        src="/images/rhmicons/manage_user.png"
        alt=""
        width={18}
        height={18}
      />
    </div>
  );
};

export const Acknowledge = () => {
  return (
    <div className="">
      <Image
        layout="fixed"
        src="/images/rhmicons/Acknowledgement.png"
        alt=""
        width={18}
        height={18}
      />
    </div>
  );
};

export const Reschedule = () => {
  return (
    <div className="">
      <Image
        layout="fixed"
        src="/images/rhmicons/reschedule.png"
        alt=""
        width={18}
        height={18}
      />
    </div>
  );
};

export const DirectAssessment = () => {
  return (
    <div className="mx-6 flex items-center">
      <Image
        layout="fixed"
        src="/images/rhmicons/Direct_assessment.png"
        alt=""
        width={18}
        height={18}
      />
    </div>
  );
};

export const Paye = () => {
  return (
    <div className="mx-6 flex items-center">
      <Image
        layout="fixed"
        src="/images/rhmicons/paye.png"
        alt=""
        width={18}
        height={18}
      />
    </div>
  );
};

export const Collections = () => {
  return (
    <div className="mx-6 flex items-center">
      <Image
        layout="fixed"
        src="/images/rhmicons/collections.png"
        alt=""
        width={18}
        height={18}
      />
    </div>
  );
};

export const Settings = () => {
  return (
    <div className="mx-6 flex items-center">
      <Image
        layout="fixed"
        src="/images/rhmicons/settings.png"
        alt=""
        width={18}
        height={18}
      />
    </div>
  );
};

export const Filter = () => {
  return (
    <div className="">
      <Image
        layout="fixed"
        src="/images/rhmicons/filter.png"
        alt=""
        width={18}
        height={18}
      />
    </div>
  );
};

export const FileReturns = () => {
  const router = useRouter();
  let { pathname } = { ...router };
  if (
    [
      "/uploads/annual",
      "/uploads/monthly",
      "/uploads/withholding",
      "/view/annual",
      "/view/monthly",
      "/view/withholding",
    ].includes(pathname)
  ) {
    return (
      <div className="mx-6 flex items-center">
        <Image
          layout="fixed"
          src="/images/icons/file_returns_blu.png"
          alt="login"
          width={18}
          height={18}
        />
      </div>
    );
  }
  return (
    <div className="mx-6 flex items-center">
      <Image
        layout="fixed"
        src="/images/icons/file_returns.png"
        alt="login"
        width={19}
        height={19}
      />
    </div>
  );
};

export const Invoice = () => {
  const router = useRouter();
  let { pathname } = { ...router };
  if (
    [
      "/payment/new-payment",
      "/payment/payment-history",
      "/payment/pending-invoice",
    ].includes(pathname)
  ) {
    return (
      <div className="mx-6 flex items-center">
        <Image
          layout="fixed"
          src="/images/icons/payment_blu.png"
          alt="login"
          width={20}
          height={20}
        />
      </div>
    );
  }
  return (
    <div className="mx-6 flex items-center">
      <Image
        layout="fixed"
        src="/images/icons/payment.png"
        alt="login"
        width={20}
        height={20}
      />
    </div>
  );
};

export const UserGuide = () => {
  return (
    <div className="mx-6 flex items-center">
      <Image
        layout="fixed"
        src="/images/icons/guide.png"
        alt="login"
        width={19}
        height={19}
      />
    </div>
  );
};
