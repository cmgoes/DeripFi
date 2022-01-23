import React from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import HomeIcon from 'assets/images/HomeIcon.png'
import PortfolioIcon from 'assets/images/PortfolioIcon.png'
import TradeIcon from 'assets/images/TradeIcon.svg'
import FarmIcon from 'assets/images/FarmsIcon.png'
import PoolIcon from 'assets/images/PoolsIcon.png'
import ReferralIcon from 'assets/images/ReferralIcon.png'
import { ReactComponent as LotteryIcon } from 'assets/images/LotteryIcon.svg'
import CollectiblesIcon from 'assets/images/CollectiblesIcon.png'
import InfoIcon from 'assets/images/InfoIcon.png'
import { ReactComponent as IMOIcon } from 'assets/images/IMOIcon.svg'
import { ReactComponent as MoreIcon } from 'assets/images/MoreIcon.svg'
import Accordion from './Accordion'
import { MenuEntry, LinkLabel, LinkStatus } from './MenuEntry'
import MenuLink from './MenuLink'
import { PanelProps, PushedProps } from '../types'

interface Props extends PanelProps, PushedProps {
  isMobile: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  & > div {
    & > a > div:nth-child(2),
    & > div > div:nth-child(2),
    & > div > div div {
      color: #938e96;
    }
    ,
    & > div > svg path {
      fill: #938e96;
    }
    &.active {
      box-shadow: inset 4px 0px 0px #524f9e;
      & > a > div:first-child {
        & svg path {
          stroke: #524f9e;
        }
      }
      & > a > div:nth-child(2),
      & > div > div:nth-child(2) {
        color: #524f9e;
      }
      & > div > svg path {
        fill: #524f9e;
      }
    }
  }
`

const IconWrapper = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  & svg path {
    fill: rgba(0, 0, 0, 0);
    stroke: #938e96;
  }
`

const MoreIconWrapper = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: #938e96;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 4px;
`

const PanelBody: React.FC<Props> = ({ isPushed, pushNav, isMobile, links }) => {
  const location = useLocation()

  // Close the menu when a user clicks a link on mobile
  const handleClick = isMobile ? () => pushNav(false) : undefined

  const IconElements = {
    Home: <img src={HomeIcon} alt="" style={{ width: 35, height: 35 }} />,
    Trade: <img src={TradeIcon} alt="" style={{ width: 35, height: 35 }} />,
    Farm: <img src={FarmIcon} alt="" style={{ width: 35, height: 35 }} />,
    Portfolio: <img src={PortfolioIcon} alt="" style={{ width: 35, height: 35 }} />,
    Pool: <img src={PoolIcon} alt="" style={{ width: 35, height: 35 }} />,
    Referral: <img src={ReferralIcon} alt="" style={{ width: 35, height: 35 }} />,
    Lottery: <LotteryIcon />,
    Collectibles: <img src={CollectiblesIcon} alt="" style={{ width: 35, height: 35 }} />,
    Info: <img src={InfoIcon} alt="" style={{ width: 35, height: 30 }} />,
    IMO: <IMOIcon />,
    More: (
      <MoreIconWrapper>
        <MoreIcon />
      </MoreIconWrapper>
    ),
  }

  return (
    <Container>
      {links.map((entry) => {
        const Icon = IconElements[entry.icon]
        const calloutClass = (entry.calloutClass || '') + (entry.href === location.pathname ? 'active' : '')

        if (entry.items) {
          const itemsMatchIndex = entry.items.findIndex((item) => item.href === location.pathname)
          const initialOpenState = entry.initialOpenState === true ? entry.initialOpenState : itemsMatchIndex >= 0

          return (
            <Accordion
              key={entry.label}
              isPushed={isPushed}
              pushNav={pushNav}
              icon={Icon}
              label={entry.label}
              status={entry.status}
              initialOpenState={initialOpenState}
              className={calloutClass}
              isActive={entry.items.some((item) => item.href === location.pathname)}
            >
              {isPushed &&
                entry.items.map((item) => (
                  <MenuEntry key={item.href} secondary isActive={item.href === location.pathname} onClick={handleClick}>
                    <MenuLink href={item.href}>
                      <LinkLabel isPushed={isPushed}>{item.label}</LinkLabel>
                      {item.status && (
                        <LinkStatus color={item.status.color} fontSize="14px">
                          {item.status.text}
                        </LinkStatus>
                      )}
                    </MenuLink>
                  </MenuEntry>
                ))}
            </Accordion>
          )
        }
        return (
          <MenuEntry key={entry.label} isActive={entry.href === location.pathname} className={calloutClass}>
            <MenuLink href={entry.href} onClick={handleClick}>
              <IconWrapper>{Icon}</IconWrapper>
              <LinkLabel isPushed={isPushed}>{entry.label}</LinkLabel>
              {entry.status && (
                <LinkStatus color={entry.status.color} fontSize="14px">
                  {entry.status.text}
                </LinkStatus>
              )}
            </MenuLink>
          </MenuEntry>
        )
      })}
    </Container>
  )
}

export default PanelBody
