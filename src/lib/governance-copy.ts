import type { Language, ProcedureFollowUp } from '../data/types'

export interface GovernanceCopy {
  tab: string
  title: string
  subtitle: string
  authoritiesTitle: string
  altruismTitle: string
  sourceDate: string
  registerNote: string
  notListed: string
  authorityRole: string
  intermediationRole: string
  altruismRole: string
  country: string
  source: string
  organisation: string
  status: string
  lastVerified: string
}

export function getGovernanceCopy(language: Language): GovernanceCopy {
  return language === 'zh'
    ? {
        tab: '治理基础设施',
        title: 'DGA 治理基础设施',
        subtitle: '把成员国主管机关快照与数据利他组织登记独立呈现；这些记录不等同于处罚或案件数量。',
        authoritiesTitle: '成员国 DGA 主管机关',
        altruismTitle: '已获认可的数据利他组织',
        sourceDate: '官方清单更新',
        registerNote: '主管机关清单是日期化快照；数据利他组织登记是公开通知记录，不等于处罚、合规认证或案件数量。',
        notListed: '未列出',
        authorityRole: '公共部门数据复用（Art. 7）',
        intermediationRole: '数据中介（Art. 13）',
        altruismRole: '数据利他（Art. 23）',
        country: '国家',
        source: '来源',
        organisation: '组织',
        status: '状态',
        lastVerified: '复核日期',
      }
    : {
        tab: 'Governance',
        title: 'DGA governance infrastructure',
        subtitle: 'National authority snapshots and the recognised data-altruism register stay separate from fines and enforcement matters.',
        authoritiesTitle: 'National DGA authorities',
        altruismTitle: 'Recognised data-altruism organisations',
        sourceDate: 'Official list update',
        registerNote: 'The authority list is a dated snapshot; the data-altruism register is a public notification record, not a fine, certification or case count.',
        notListed: 'Not listed',
        authorityRole: 'Public-sector data reuse (Art. 7)',
        intermediationRole: 'Data intermediation (Art. 13)',
        altruismRole: 'Data altruism (Art. 23)',
        country: 'Country',
        source: 'Source',
        organisation: 'Organisation',
        status: 'Status',
        lastVerified: 'Last verified',
      }
}

export function getFollowUpStatusCopy(status: ProcedureFollowUp['status'], language: Language): string {
  if (status === 'located') return language === 'zh' ? '已定位后续信号' : 'Later signal located'
  if (status === 'pending_review') return language === 'zh' ? '待复核' : 'Pending review'
  return language === 'zh' ? '未定位到后续信号' : 'No later signal located'
}
