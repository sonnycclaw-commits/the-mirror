/**
 * ContractView - S5-T03
 *
 * The complete Momentum Contract display.
 * Designed to be shareable/screenshottable.
 */
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ContractCard } from './ContractCard'
import { EvidenceList, type EvidenceItem } from './EvidenceList'

// Sign button with loading/error feedback
function SignButton({ onSign }: { onSign: () => void | Promise<void> }) {
  const [isSigning, setIsSigning] = useState(false)
  const [signError, setSignError] = useState<string | null>(null)

  const handleSign = async () => {
    setIsSigning(true)
    setSignError(null)
    try {
      await onSign()
    } catch (err) {
      setSignError(err instanceof Error ? err.message : 'Failed to sign contract')
    } finally {
      setIsSigning(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: 1.1 }}
      className="flex flex-col items-center gap-3 pt-6"
    >
      <button
        onClick={handleSign}
        disabled={isSigning}
        className="
          px-8 py-4 rounded-full
          bg-gradient-to-r from-emerald-500 to-teal-500
          text-white font-semibold text-lg
          shadow-[0_0_30px_rgba(16,185,129,0.4)]
          hover:shadow-[0_0_50px_rgba(16,185,129,0.6)]
          hover:scale-105
          active:scale-95
          disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
          transition-all duration-200
          flex items-center gap-2
        "
      >
        {isSigning ? (
          <>
            <div className="animate-spin size-5 border-2 border-white border-t-transparent rounded-full" />
            Signing...
          </>
        ) : (
          'Sign My Contract'
        )}
      </button>
      {signError && (
        <p className="text-red-400 text-sm">{signError}</p>
      )}
    </motion.div>
  )
}

export interface ContractData {
  refusal: string
  becoming: string
  proof: string
  test: string
  vote: string
  rule: string
  evidence?: EvidenceItem[]
  mirrorMoment?: string
  primaryContradiction?: {
    stated: string
    actual: string
  }
  signedAt?: number
  status: 'DRAFT' | 'SIGNED'
}

export interface ContractViewProps {
  contract: ContractData
  onSign?: () => void
  onShare?: () => void
}

export function ContractView({ contract, onSign, onShare }: ContractViewProps) {
  const isSigned = contract.status === 'SIGNED'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold text-white">Momentum Contract</h1>
        <p className="text-slate-400">Your commitment to becoming</p>
      </motion.div>

      {/* Mirror Moment (if present) */}
      {contract.mirrorMoment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="
            p-6 rounded-2xl
            bg-gradient-to-br from-violet-900/30 to-indigo-900/30
            border border-violet-500/20
            backdrop-blur-xl
          "
        >
          <p className="text-lg text-violet-200 italic text-center leading-relaxed">
            "{contract.mirrorMoment}"
          </p>
        </motion.div>
      )}

      {/* Primary Contradiction */}
      {contract.primaryContradiction && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="
            p-4 rounded-xl
            bg-amber-900/20 border border-amber-500/20
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg"></span>
            <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">
              The Gap
            </span>
          </div>
          <p className="text-slate-300">
            <span className="text-amber-400">You said:</span> "{contract.primaryContradiction.stated}"
          </p>
          <p className="text-slate-300 mt-1">
            <span className="text-amber-400">You showed:</span> "{contract.primaryContradiction.actual}"
          </p>
        </motion.div>
      )}

      {/* Contract Cards */}
      <div className="space-y-4">
        <ContractCard
          label="The Refusal"
          prefix="I refuse to"
          content={contract.refusal.replace(/^I refuse to\s*/i, '')}
          icon="🚫"
          color="ruby"
          delay={0.4}
        />

        <ContractCard
          label="The Identity"
          prefix="I am the person who"
          content={contract.becoming.replace(/^I am the (type of )?person who\s*/i, '')}
          icon="👤"
          color="emerald"
          delay={0.5}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ContractCard
            label="1-Year Proof"
            prefix=""
            content={contract.proof}
            icon="🎯"
            color="sapphire"
            delay={0.6}
          />

          <ContractCard
            label="1-Month Test"
            prefix=""
            content={contract.test}
            icon="📅"
            color="violet"
            delay={0.7}
          />
        </div>

        <ContractCard
          label="Today's Vote"
          prefix=""
          content={contract.vote}
          icon="✅"
          color="amber"
          delay={0.8}
        />

        <ContractCard
          label="Non-Negotiable"
          prefix=""
          content={contract.rule}
          icon="🔒"
          color="slate"
          delay={0.9}
        />
      </div>

      {/* Evidence */}
      {contract.evidence && contract.evidence.length > 0 && (
        <EvidenceList evidence={contract.evidence} delay={1.0} />
      )}

      {/* Action Buttons */}
      <AnimatePresence>
        {!isSigned && onSign && (
          <SignButton onSign={onSign} />
        )}

        {isSigned && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 pt-6"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl"></span>
              <span className="text-emerald-400 font-semibold">Contract Signed</span>
            </div>

            {contract.signedAt && (
              <p className="text-sm text-slate-500">
                {new Date(contract.signedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}

            {onShare && (
              <button
                onClick={onShare}
                className="
                  px-6 py-3 rounded-full
                  bg-slate-800 border border-slate-700
                  text-slate-300 font-medium
                  hover:bg-slate-700 hover:border-slate-600
                  transition-colors
                "
              >
                📤 Share Contract
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
