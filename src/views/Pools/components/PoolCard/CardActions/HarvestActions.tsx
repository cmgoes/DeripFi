import React from 'react'
import styled from 'styled-components'
import { Flex, Button, useModal, Skeleton } from 'uikit'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { Token } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { useCakeVault } from 'state/pools/hooks'
import { ReactComponent as ArrowDown } from 'assets/images/ArrowDown.svg'
import { ReactComponent as ArrowUp } from 'assets/images/ArrowUp.svg'
import useToast from 'hooks/useToast'
import ApprovalAction from './ApprovalAction'
import CollectModal from '../Modals/CollectModal'
import EarningsCell from '../../PoolsTable/Cells/EarningsCell'
import useHarvestPool from '../../../hooks/useHarvestPool'
import useStakePool from '../../../hooks/useStakePool'

import NotEnoughTokensModal from '../Modals/NotEnoughTokensModal'
import StakeModal from '../Modals/StakeModal'
import VaultStakeModal from '../../CakeVaultCard/VaultStakeModal'

interface HarvestActionsProps {
  earnings: BigNumber
  earningToken: Token
  sousId: number
  earningTokenPrice: number
  isBnbPool: boolean
  isLoading?: boolean
  needsApproval: boolean
  pool: any
  isExpanded: boolean
  userDataLoaded: boolean
  account: string
  setExpanded: () => void
}

const ArrowWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const EarnedText = styled.div`
  & h2 {
    font-family: 'OpenSans-Bold';
    font-size: 12px;
    font-weight: normal;

    ${({ theme }) => theme.mediaQueries.sm} {
      font-family: 'Ubuntu';
      font-size: 14px;
    }
  }

  & p, span {
    font-family: 'Ubuntu';
    font-size: 12px;

    ${({ theme }) => theme.mediaQueries.sm} {
      font-size: 18px;
      font-weight: bold;
    }
  }
`

const RoundedButton = styled(Button)`
  border-radius: 18px;
  font-size: 10px !important;
  padding: 12px 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 14px !important;
  }
`

const HarvestActions: React.FC<HarvestActionsProps> = ({
  earnings,
  earningToken,
  sousId,
  isBnbPool,
  earningTokenPrice,
  isLoading = false,
  needsApproval,
  pool,
  isExpanded,
  setExpanded,
  account,
  userDataLoaded
}) => {
  const {
    isAutoVault,
    userData,
    stakingTokenPrice,
    stakingToken,
  } = pool
  const { t } = useTranslation()
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)
  const {
    userData: { userShares },
    pricePerFullShare,
  } = useCakeVault()

  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isNotVaultAndHasStake = !isAutoVault && stakedBalance.gt(0)
  const hasSharesStaked = userShares && userShares.gt(0)
  const isVaultWithShares = isAutoVault && hasSharesStaked
  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const hasEarnings = earnings.toNumber() > 0
  const isCompoundPool = sousId === 0
  const { onReward } = useHarvestPool(sousId, isBnbPool)
  const { onStake } = useStakePool(sousId, isBnbPool)
  const { toastSuccess, toastError } = useToast()

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)
  const onPresentCollect = async () => {
    try {
      await onStake(fullBalance, earningToken.decimals)
      toastSuccess(
        `${t('Compounded')}!`,
        t('Your %symbol% earnings have been re-invested into the pool!', { symbol: earningToken.symbol }),
      )
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      console.error(e)
    }
  }
  const [onPresentVaultStake] = useModal(<VaultStakeModal stakingMax={stakingTokenBalance} pool={pool} />)
  const [onPresentStake] = useModal(
    <StakeModal
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenBalance={stakingTokenBalance}
      stakingTokenPrice={stakingTokenPrice}
    />,
  )
  // const [onPresentCollect] = useModal(
  //   <CollectModal
  //     formattedBalance={formattedBalance}
  //     fullBalance={fullBalance}
  //     earningToken={earningToken}
  //     earningsDollarValue={earningTokenDollarBalance}
  //     sousId={sousId}
  //     isBnbPool={isBnbPool}
  //     isCompoundPool={isCompoundPool}
  //   />,
  // )

  const onStakeHandler = () => {
    if (isAutoVault) {
      onPresentVaultStake()
    } else {
      onPresentStake()
    }
  }

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {isLoading ? (
        <Skeleton width="80px" height="48px" />
      ) : (
        <>
          <EarnedText>
            <h2 style={{ fontSize: 14, fontWeight: 700 }}>{t('Earned')}</h2>
            {/* <p>999, 999, 999</p> */}
            <EarningsCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
            {/* {hasEarnings ? (
              <Balance decimals={5} value={earningTokenBalance} />
            ) : (
              <h2>0</h2>
            )} */}
          </EarnedText>
          <Flex>
            {needsApproval ? <ApprovalAction pool={pool} isLoading={isLoading} /> :
              (isNotVaultAndHasStake || isVaultWithShares) && sousId === 0 ?
                <RoundedButton onClick={onPresentCollect}>
                  {/* {isCompoundPool ? t('Collect') : t('Harvest')} */}
                  {t('Compound')}
                </RoundedButton> :
                (isNotVaultAndHasStake || isVaultWithShares) && sousId !== 0 ?
                  <RoundedButton onClick={async () => {
                    try {
                      await onReward()
                      toastSuccess(
                        `${t('Harvested')}!`,
                        t('Your %symbol% earnings have been sent to your wallet!', { symbol: earningToken.symbol }),
                      )
                    } catch (e) {
                      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
                    }
                  }}>{t('Harvest')}</RoundedButton> :
                  <RoundedButton onClick={stakingTokenBalance.gt(0) ? onStakeHandler : onPresentTokenRequired}>
                    {/* {isCompoundPool ? t('Collect') : t('Harvest')} */}
                    {t('Stake MON')}
                  </RoundedButton>
            }
            {/* {hasEarnings && (
              <Button onClick={onPresentCollect}>
                {t('Compound')}
              </Button>
            )} */}

            <ArrowWrapper onClick={setExpanded}>{isExpanded ? <ArrowUp /> : <ArrowDown />}</ArrowWrapper>
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default HarvestActions
