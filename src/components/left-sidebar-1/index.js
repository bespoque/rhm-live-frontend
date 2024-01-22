import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import Title from './title';
import Item from './item';
import Logo from './logo';
import jwt from 'jsonwebtoken';


const LeftSidebar = () => {
  const {
    authentication,
    navigationApprover,
    navigationApproverTcc,
    navigationCreator,
    navigationCreatorTcc,
    navigationAdmin,
    navigationReport,
    navigationAuditPrint,
    navigationOtherTaxes,
    navigationBDPRS,
    navigationAudit
  } = useSelector(
    (state) => ({
      navigationAdmin: state.navigationAdmin,
      authentication: state.authentication.auth,
      navigationApprover: state.navigationApprover,
      navigationCreator: state.navigationCreator,
      navigationCreatorTcc: state.navigationCreatorTcc,
      navigationReport: state.navigationReport,
      navigationApproverTcc: state.navigationApproverTcc,
      navigationAuditPrint: state.navigationAuditPrint,
      navigationAudit: state.navigationAudit,
      navigationOtherTaxes: state.navigationOtherTaxes,
      navigationBDPRS: state.navigationBDPRS
    }),
    shallowEqual
  );

  let approverRange = [1, 2, 3, 12, 21, 27, 20]
  let adminRange = [1]
  let payeTccApprover = [30]
  // let creatorRange = [1, 4, 13, 15]
  let creatorRange = [
    "m.adibaba@irs.kg.gov.ng",
    "arowosegbe.t@irs.kg.gov.ng",
    "s.simpa@irs.kg.gov.ng",
    "salami.y@irs.kg.gov.ng",
    "o.thomas@irs.kg.gov.ng",
    "b.enyojo@irs.kg.gov.ng",
    "z.haruna@irs.kg.gov.ng",
    "s.ojo@irs.kg.gov.ng",
    "a.fatima@irs.kg.gov.ng",
    "o.abiodun@irs.kg.gov.ng",
    "m.obadaki@irs.kg.gov.ng",
    "a.ize@irs.kg.gov.ng"
  ]
  let payeTccInitiator = [29]
  let reportRange = [39, 9]
  let auditPrint = [42, 19]
  let audit = [19]
  let otherTaxes = [24]
  let bdprs = [6, 7]

  let StaffType;
  let staffEmail
  if (authentication) {
    StaffType = jwt.decode(authentication)?.groups;
    staffEmail = jwt.decode(authentication)?.user;
  }

  console.log("staffEmail", staffEmail);

  if (StaffType.some(r => adminRange.includes(r))) {
    return (
      <div className="left-sidebar left-sidebar-1">
        <Logo />
        {navigationAdmin.map((menu, i) => (
          <React.Fragment key={i}>
            <Title>{menu.title}</Title>
            <ul>
              {menu.items.map((l0, a) => (
                <li key={a} className="l0">
                  <Item {...l0} />
                  <ul>
                    {l0.items.map((l1, b) => (
                      <li key={b} className="l1">
                        <Item {...l1} />
                        <ul className="">
                          {l1.items.map((l2, c) => (
                            <li key={c} className="">
                              <Item {...l2} />
                              <ul>
                                {l2.items.map((l3, d) => (
                                  <li key={d} className="l3">
                                    <Item {...l3} />
                                    <ul>
                                      {l3.items.map((l4, e) => (
                                        <li key={e} className="l4">
                                          <Item {...l4} />
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (StaffType.some(r => payeTccInitiator.includes(r))) {
    return (
      <div className="left-sidebar left-sidebar-1">
        <Logo />
        {navigationCreatorTcc.map((menu, i) => (
          <React.Fragment key={i}>
            <Title>{menu.title}</Title>
            <ul>
              {menu.items.map((l0, a) => (
                <li key={a} className="l0">
                  <Item {...l0} />
                  <ul>
                    {l0.items.map((l1, b) => (
                      <li key={b} className="l1">
                        <Item {...l1} />
                        <ul className="">
                          {l1.items.map((l2, c) => (
                            <li key={c} className="">
                              <Item {...l2} />
                              <ul>
                                {l2.items.map((l3, d) => (
                                  <li key={d} className="l3">
                                    <Item {...l3} />
                                    <ul>
                                      {l3.items.map((l4, e) => (
                                        <li key={e} className="l4">
                                          <Item {...l4} />
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (StaffType.some(r => payeTccApprover.includes(r))) {
    return (
      <div className="left-sidebar left-sidebar-1">
        <Logo />
        {navigationApproverTcc.map((menu, i) => (
          <React.Fragment key={i}>
            <Title>{menu.title}</Title>
            <ul>
              {menu.items.map((l0, a) => (
                <li key={a} className="l0">
                  <Item {...l0} />
                  <ul>
                    {l0.items.map((l1, b) => (
                      <li key={b} className="l1">
                        <Item {...l1} />
                        <ul className="">
                          {l1.items.map((l2, c) => (
                            <li key={c} className="">
                              <Item {...l2} />
                              <ul>
                                {l2.items.map((l3, d) => (
                                  <li key={d} className="l3">
                                    <Item {...l3} />
                                    <ul>
                                      {l3.items.map((l4, e) => (
                                        <li key={e} className="l4">
                                          <Item {...l4} />
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (StaffType.some(r => reportRange.includes(r))) {
    return (
      <div className="left-sidebar left-sidebar-1">
        <Logo />
        {navigationReport.map((menu, i) => (
          <React.Fragment key={i}>
            <Title>{menu.title}</Title>
            <ul>
              {menu.items.map((l0, a) => (
                <li key={a} className="l0">
                  <Item {...l0} />
                  <ul>
                    {l0.items.map((l1, b) => (
                      <li key={b} className="l1">
                        <Item {...l1} />
                        <ul className="">
                          {l1.items.map((l2, c) => (
                            <li key={c} className="">
                              <Item {...l2} />
                              <ul>
                                {l2.items.map((l3, d) => (
                                  <li key={d} className="l3">
                                    <Item {...l3} />
                                    <ul>
                                      {l3.items.map((l4, e) => (
                                        <li key={e} className="l4">
                                          <Item {...l4} />
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (StaffType.some(r => auditPrint.includes(r))) {
    return (
      <div className="left-sidebar left-sidebar-1">
        <Logo />
        {navigationAuditPrint.map((menu, i) => (
          <React.Fragment key={i}>
            <Title>{menu.title}</Title>
            <ul>
              {menu.items.map((l0, a) => (
                <li key={a} className="l0">
                  <Item {...l0} />
                  <ul>
                    {l0.items.map((l1, b) => (
                      <li key={b} className="l1">
                        <Item {...l1} />
                        <ul className="">
                          {l1.items.map((l2, c) => (
                            <li key={c} className="">
                              <Item {...l2} />
                              <ul>
                                {l2.items.map((l3, d) => (
                                  <li key={d} className="l3">
                                    <Item {...l3} />
                                    <ul>
                                      {l3.items.map((l4, e) => (
                                        <li key={e} className="l4">
                                          <Item {...l4} />
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (StaffType.some(r => audit.includes(r))) {
    return (
      <div className="left-sidebar left-sidebar-1">
        <Logo />
        {navigationAudit.map((menu, i) => (
          <React.Fragment key={i}>
            <Title>{menu.title}</Title>
            <ul>
              {menu.items.map((l0, a) => (
                <li key={a} className="l0">
                  <Item {...l0} />
                  <ul>
                    {l0.items.map((l1, b) => (
                      <li key={b} className="l1">
                        <Item {...l1} />
                        <ul className="">
                          {l1.items.map((l2, c) => (
                            <li key={c} className="">
                              <Item {...l2} />
                              <ul>
                                {l2.items.map((l3, d) => (
                                  <li key={d} className="l3">
                                    <Item {...l3} />
                                    <ul>
                                      {l3.items.map((l4, e) => (
                                        <li key={e} className="l4">
                                          <Item {...l4} />
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (StaffType.some(r => otherTaxes.includes(r))) {
    return (
      <div className="left-sidebar left-sidebar-1">
        <Logo />
        {navigationOtherTaxes.map((menu, i) => (
          <React.Fragment key={i}>
            <Title>{menu.title}</Title>
            <ul>
              {menu.items.map((l0, a) => (
                <li key={a} className="l0">
                  <Item {...l0} />
                  <ul>
                    {l0.items.map((l1, b) => (
                      <li key={b} className="l1">
                        <Item {...l1} />
                        <ul className="">
                          {l1.items.map((l2, c) => (
                            <li key={c} className="">
                              <Item {...l2} />
                              <ul>
                                {l2.items.map((l3, d) => (
                                  <li key={d} className="l3">
                                    <Item {...l3} />
                                    <ul>
                                      {l3.items.map((l4, e) => (
                                        <li key={e} className="l4">
                                          <Item {...l4} />
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    );
  }
  if (StaffType.some(r => bdprs.includes(r))) {
    return (
      <div className="left-sidebar left-sidebar-1">
        <Logo />
        {navigationBDPRS.map((menu, i) => (
          <React.Fragment key={i}>
            <Title>{menu.title}</Title>
            <ul>
              {menu.items.map((l0, a) => (
                <li key={a} className="l0">
                  <Item {...l0} />
                  <ul>
                    {l0.items.map((l1, b) => (
                      <li key={b} className="l1">
                        <Item {...l1} />
                        <ul className="">
                          {l1.items.map((l2, c) => (
                            <li key={c} className="">
                              <Item {...l2} />
                              <ul>
                                {l2.items.map((l3, d) => (
                                  <li key={d} className="l3">
                                    <Item {...l3} />
                                    <ul>
                                      {l3.items.map((l4, e) => (
                                        <li key={e} className="l4">
                                          <Item {...l4} />
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    );
  }


  else if (StaffType.some(r => approverRange.includes(r))) {
    return (
      <div className="left-sidebar left-sidebar-1">
        <Logo />

        {navigationApprover.map((menu, i) => (
          <React.Fragment key={i}>
            <Title>{menu.title}</Title>
            <ul>
              {menu.items.map((l0, a) => (
                <li key={a} className="l0">
                  <Item {...l0} />
                  <ul>
                    {l0.items.map((l1, b) => (
                      <li key={b} className="l1">
                        <Item {...l1} />
                        <ul className="">
                          {l1.items.map((l2, c) => (
                            <li key={c} className="">
                              <Item {...l2} />
                              <ul>
                                {l2.items.map((l3, d) => (
                                  <li key={d} className="l3">
                                    <Item {...l3} />
                                    <ul>
                                      {l3.items.map((l4, e) => (
                                        <li key={e} className="l4">
                                          <Item {...l4} />
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    );
  }

  else if (staffEmail.includes(creatorRange)) {
    return (
      <div className="left-sidebar left-sidebar-1">
        <Logo />

        {navigationCreator.map((menu, i) => (
          <React.Fragment key={i}>
            <Title>{menu.title}</Title>
            <ul>
              {menu.items.map((l0, a) => (
                <li key={a} className="l0">
                  <Item {...l0} />
                  <ul>
                    {l0.items.map((l1, b) => (
                      <li key={b} className="l1">
                        <Item {...l1} />
                        <ul className="">
                          {l1.items.map((l2, c) => (
                            <li key={c} className="">
                              <Item {...l2} />
                              <ul>
                                {l2.items.map((l3, d) => (
                                  <li key={d} className="l3">
                                    <Item {...l3} />
                                    <ul>
                                      {l3.items.map((l4, e) => (
                                        <li key={e} className="l4">
                                          <Item {...l4} />
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="left-sidebar left-sidebar-1">
      <Logo />

      {navigationReport.map((menu, i) => (
        <React.Fragment key={i}>
          <Title>{menu.title}</Title>
          <ul>
            {menu.items.map((l0, a) => (
              <li key={a} className="l0">
                <Item {...l0} />
                <ul>
                  {l0.items.map((l1, b) => (
                    <li key={b} className="l1">
                      <Item {...l1} />
                      <ul className="">
                        {l1.items.map((l2, c) => (
                          <li key={c} className="">
                            <Item {...l2} />
                            <ul>
                              {l2.items.map((l3, d) => (
                                <li key={d} className="l3">
                                  <Item {...l3} />
                                  <ul>
                                    {l3.items.map((l4, e) => (
                                      <li key={e} className="l4">
                                        <Item {...l4} />
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </div>
  );
};

export default LeftSidebar;
